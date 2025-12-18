import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function sendWelcomeEmail(email: string) {
  if (!resend) {
    console.warn(`[Email Simulation] Welcome email would be sent to: ${email}`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "IFYBEST <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to IFYBEST! 🎨",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #6366f1;">Welcome to IFYBEST!</h1>
          <p>We're thrilled to have you in our community of vibrant and simple living seekers.</p>
          <p>As a subscriber, you'll be the first to know about:</p>
          <ul>
            <li>✨ Exclusive product drops</li>
            <li>🔥 Holiday sales and discounts</li>
            <li>🎁 Special surprises just for you</li>
          </ul>
          <p>Happy shopping!</p>
          <hr />
          <p style="font-size: 12px; color: #999;">If you didn't subscribe, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email send exception:", err);
    return { success: false, error: err };
  }
}
