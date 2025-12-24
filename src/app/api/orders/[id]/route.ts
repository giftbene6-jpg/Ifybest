import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const query = `*[_type == "order" && (orderNumber == $id || _id == $id)][0]{
      _id,
      orderNumber,
      status,
      totalPrice,
      amountDiscount,
      orderDate,
      customerName,
      email,
      promoCode,
      paystackReference,
      paystackTransactionId,
      currency,
      products[]{ 
        quantity, 
        price,
        name,
        image,
        product->{_id, name, price, currency, image} 
      }
    }`;

    const order = await backendClient.fetch(query, { id });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Fetch order error", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
