/**
 * PAYSTACK WEBHOOK SETUP INSTRUCTIONS
 * 
 * 1. Make sure your dev server is running:
 *    npm run dev
 * 
 * 2. For local testing with Paystack CLI:
 *    You already have Paystack CLI logged in. Run:
 *    paystack listen http://localhost:3000/api/webhook/paystack
 * 
 * 3. For production:
 *    - Go to https://dashboard.paystack.com/settings/developer
 *    - Under "Webhooks", set URL to: https://your-domain.com/api/webhook/paystack
 *    - Select the events you want to listen to (charge.success, charge.failed, etc.)
 * 
 * 4. The webhook handler at /api/webhook/paystack:
 *    - Verifies the Paystack signature
 *    - Handles charge.success events
 *    - Sends confirmation emails (if email service configured)
 *    - You can save order data to your database here
 * 
 * TEST FLOW:
 * 1. Add items to basket
 * 2. Click "Proceed to Checkout"
 * 3. Click "Pay Now"
 * 4. Use Paystack test card:
 *    - Card: 4084 0343 6173 0175
 *    - Expiry: 12/25
 *    - CVV: 812
 * 5. You'll be redirected to /checkout/success after payment
 * 6. Check server logs for webhook event
 * 
 * EMAIL INTEGRATION:
 * To send actual confirmation emails, update the sendConfirmationEmail function in:
 * /api/webhook/paystack/route.ts
 * 
 * Options:
 * - Resend: npm install resend
 * - SendGrid: npm install @sendgrid/mail
 * - Nodemailer: npm install nodemailer
 */

export {};
