import { NextRequest, NextResponse } from "next/server";
import { createPaystackTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const { email, amount, items, promoCode, discount, clerkUserId, customerName } = await req.json();

    if (!email || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid email or amount" },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Determine the base URL dynamically from the request headers or fallback to env/localhost
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const base = `${protocol}://${host}`;
    const callback_url = `${base}/checkout/success`;

    // Initialize Paystack transaction
    const paystackResponse = await createPaystackTransaction(
      email,
      amount,
      reference,
      {
        cartItems: items,
        userId: clerkUserId,
        userEmail: email,
        userName: customerName,
        promoCode: promoCode || null,
        discount: discount,
      },
      callback_url
    );

    if (!paystackResponse.status) {
      return NextResponse.json(
        { error: paystackResponse.message || "Paystack initialization failed" },
        { status: 400 }
      );
    }

    // Return authorization URL for client redirect
    return NextResponse.json({
      authorizationUrl: paystackResponse.data.authorization_url,
      reference: reference,
      accessCode: paystackResponse.data.access_code,
    });
  } catch (error) {
    console.error("Checkout initialization error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
