import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send the welcome email
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to IFYBEST Newsletter!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to IFYBEST!</h1>
          <p>Hi there,</p>
          <p>Thank you for subscribing to our newsletter! We're excited to have you on board.</p>
          <p>You'll be the first to know about our latest drops, exclusive offers, and style tips.</p>
          <p>Stay tuned!</p>
          <p>Best regards,<br/>The IFYBEST Team</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
