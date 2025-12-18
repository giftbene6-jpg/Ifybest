import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    console.log(`[Newsletter] Subscribing: ${email}`);

    // Send welcome email
    await sendWelcomeEmail(email);

    return NextResponse.json({ 
      success: true, 
      message: "Subscribed successfully! Welcome email sent." 
    });

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
