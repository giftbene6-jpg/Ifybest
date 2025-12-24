import { NextResponse } from "next/server";
import { mockTransactions } from "@/lib/paystack";
// import { backendClient } from "@/sanity/lib/backendClient";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const reference = url.searchParams.get("reference");
    if (!reference) return NextResponse.json({ error: "reference required" }, { status: 400 });

    const tx = mockTransactions[reference];
    if (!tx) return NextResponse.json({ error: "transaction not found" }, { status: 404 });

    mockTransactions[reference] = { ...tx, status: "success", paidAt: Date.now() };

    // Determine the base URL dynamically from the request headers
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const base = `${protocol}://${host}`;

    // Simulate webhook call to create order
    try {
      // Use internal localhost for the webhook call if possible to avoid ngrok limits/latency
      const webhookBase = host.includes("localhost") ? base : "http://localhost:3000";
      await fetch(`${webhookBase}/api/webhook/paystack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-paystack-signature": "mock-signature",
        },
        body: JSON.stringify({
          event: "charge.success",
          data: {
            reference,
            amount: tx.amount,
            customer: { email: tx.email },
            metadata: tx.metadata || {},
          },
        }),
      });
    } catch (err) {
      console.error("Failed to trigger mock webhook during redirect", err);
    }

    return NextResponse.redirect(`${base}/checkout/success?reference=${encodeURIComponent(reference)}`);
  } catch (err) {
    console.error("mock redirect error", err);
    return NextResponse.json({ error: "mock redirect failed" }, { status: 500 });
  }
}
