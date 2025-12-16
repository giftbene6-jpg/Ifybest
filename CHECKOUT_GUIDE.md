# Complete Checkout & Paystack Integration - Testing Guide

## ✅ What Was Built

### 1. **Checkout Page** (`/checkout`)
- Displays all cart items with NGN currency (₦)
- Shows order summary with subtotal and total
- Promo code field (try: **SAVE10** or **SAVE20**)
- Secure Paystack payment initialization
- Sign-in gating (must be signed in to proceed)

### 2. **Success Page** (`/checkout/success?reference=...`)
- Green checkmark (✓) icon
- "Thank you for your order" message
- "Your order has been confirmed and will be shipped shortly"
- Order number display
- Email confirmation message
- Two buttons:
  - **View Order Details** → `/orders/{orderNumber}`
  - **Continue Shopping** → `/` (home page)

### 3. **Backend API Routes**
- `/api/checkout/initialize` - Initializes Paystack transaction (server-side)
- `/api/checkout/verify` - Verifies payment after redirect
- `/api/webhook/paystack` - Handles webhook events from Paystack (signature verification)

### 4. **Currency Change**
- All prices now display in **NGN** (Nigerian Naira) instead of $
- Cart page updated to use `.toLocaleString("en-NG")`

### 5. **Promo Codes**
- **SAVE10** - 10% discount (multiplier 0.9)
- **SAVE20** - 20% discount (multiplier 0.8)

---

## 🚀 Testing Locally

### Step 1: Start Dev Server
```powershell
npm run dev
```
Server will run on `http://localhost:3001`

### Step 2: Test the Checkout Flow
1. Open `http://localhost:3001` in browser
2. Add products to basket
3. Click "My Basket" or go to `/basket`
4. Click "Proceed to Checkout"
5. Fill in promo code (optional): `SAVE10` or `SAVE20`
6. Click "Pay Now"

### Step 3: Use Paystack Test Card
When redirected to Paystack payment page:
- **Card Number:** `4084 0343 6173 0175`
- **Expiry:** `12/25`
- **CVV:** `812`
- **OTP:** `123456`

### Step 4: View Success Page
After successful payment, you'll see the success page with:
- Order number
- Confirmation message
- Email notification status
- View Order Details & Continue Shopping buttons

---

## 🔗 Setting Up Paystack Webhook (Local Testing)

### You Already Have Paystack CLI Logged In
Run this command to forward webhook events to your local server:

```powershell
paystack listen http://localhost:3001/api/webhook/paystack
```

This will:
- Listen for all Paystack events
- Forward them to your `/api/webhook/paystack` endpoint
- The webhook handler will verify the signature and process `charge.success` events

### Check Logs
Watch the terminal where `npm run dev` is running - you'll see webhook events logged:
```
✓ Payment successful for order ORDER-1732504123456-ABC123DEF
[EMAIL] Confirmation sent to user@example.com
```

---

## 💾 Production Webhook Setup

For production, configure the webhook in Paystack Dashboard:
1. Go to https://dashboard.paystack.com/settings/developer
2. Under **Webhooks**, set URL to:
   ```
   https://your-domain.com/api/webhook/paystack
   ```
3. Select events: `charge.success`, `charge.failed`
4. Your secret key will be verified automatically

---

## 📧 Email Integration (Next Steps)

Currently, the webhook logs email sends. To actually send emails, install an email service:

### Option 1: Resend (Recommended)
```powershell
npm install resend
```
Then update `/api/webhook/paystack/route.ts`:
```typescript
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "orders@yourstore.com",
  to: email,
  subject: "Order Confirmation",
  html: `Order ${orderData.orderNumber} confirmed!`
});
```

### Option 2: SendGrid
```powershell
npm install @sendgrid/mail
```

### Option 3: Nodemailer
```powershell
npm install nodemailer
```

---

## 🔐 Security Notes

### ✅ Secret Key Protection
- `PAYSTACK_LIVE_SECRET_KEY` is **never** exposed to client
- All payment operations happen server-side only
- Webhook signature is verified with secret key
- Public key only used for client-side (if needed)

### ✅ Webhook Signature Verification
- Every webhook is verified using HMAC-SHA512
- Only legitimate Paystack events are processed
- Invalid signatures are rejected with 401 status

---

## 📁 File Structure
```
src/
├── app/
│   ├── (store)/
│   │   ├── checkout/
│   │   │   ├── page.tsx          ← Checkout page route
│   │   │   └── success/
│   │   │       └── page.tsx      ← Success page route
│   │   ├── orders/
│   │   │   ├── page.tsx          ← Orders list
│   │   │   └── [id]/
│   │   │       └── page.tsx      ← Order details
│   │   └── basket/page.tsx       ← Updated with Proceed to Checkout
│   ├── api/
│   │   ├── checkout/
│   │   │   ├── initialize/route.ts  ← Create transaction
│   │   │   └── verify/route.ts      ← Verify payment
│   │   └── webhook/
│   │       └── paystack/route.ts    ← Webhook handler
├── components/
│   ├── CheckoutPage.tsx          ← Checkout UI
│   └── CartPage.tsx              ← Updated with NGN
├── lib/
│   └── paystack.ts               ← Server-side helpers
└── context/
    └── CartProvider.tsx          ← Unchanged
```

---

## 🧪 Testing Scenarios

### ✅ Successful Payment
1. Use test card → OTP 123456 → Success page appears

### ✅ Promo Code
1. Enter SAVE10 → Total reduces by 10%
2. Enter SAVE20 → Total reduces by 20%
3. Enter invalid code → Error message appears

### ✅ Sign-In Requirement
1. Try accessing /checkout without signing in → Redirected to sign-in

### ✅ Empty Basket
1. Clear basket → /checkout shows empty message

### ✅ Webhook Event
1. After payment → Check terminal for "Payment successful" log

---

## 📝 TODO: Production Features

- [ ] Save orders to database (currently only logged)
- [ ] Implement full email sending (currently logged)
- [ ] Add order status tracking (pending, shipped, delivered)
- [ ] Add refund handling
- [ ] Implement inventory deduction on purchase
- [ ] Add order history search/filter
- [ ] Implement admin dashboard for orders

---

## 🆘 Troubleshooting

### Webhook Not Triggering?
```powershell
# Check Paystack CLI is running
paystack listen http://localhost:3001/api/webhook/paystack

# Watch for errors in npm run dev terminal
```

### Port 3001 in Use?
```powershell
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or just run npm run dev again (will try 3002, 3003, etc.)
```

### Payment Not Initializing?
1. Check `.env.local` has `PAYSTACK_LIVE_SECRET_KEY`
2. Check user is signed in (Clerk)
3. Check console for API errors
4. Verify network tab in browser DevTools

---

## 🎉 You're All Set!

The complete checkout and Paystack integration is ready. Test it out and let me know if you need any adjustments!
