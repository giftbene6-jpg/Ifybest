import { NextResponse } from "next/server";
import { mockTransactions } from "@/lib/paystack";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const reference = body.reference as string | undefined;

		if (!reference) return NextResponse.json({ error: "reference required" }, { status: 400 });

		const tx = mockTransactions[reference];
		if (!tx) return NextResponse.json({ error: "transaction not found" }, { status: 404 });

		mockTransactions[reference] = { ...tx, status: "success", paidAt: Date.now() };

		const payload = {
			event: "charge.success",
			data: {
				reference,
				amount: tx.amount,
				customer: { email: tx.email },
				metadata: tx.metadata, // Pass metadata
			},
		};

		// Call the actual webhook handler
		const webhookUrl = new URL("/api/webhook/paystack", request.url);
		const res = await fetch(webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-paystack-signature": "mock-signature", // We need to handle this in webhook
			},
			body: JSON.stringify(payload),
		});

		const result = await res.json();

		return NextResponse.json({ ok: true, webhookResult: result });
	} catch (err) {
		console.error("mock-trigger error", err);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}
