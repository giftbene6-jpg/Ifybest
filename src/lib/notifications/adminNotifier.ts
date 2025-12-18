import { OrderAnalysis } from '../ai/orderAnalyzer';

export interface AdminNotificationData {
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  analysis: OrderAnalysis;
}

/**
 * Sends admin notification for high-risk or VIP orders
 */
export async function notifyAdmin(data: AdminNotificationData): Promise<void> {
  const { orderNumber, customerName, email, totalPrice, analysis } = data;

  // Check if notifications are enabled
  const notificationsEnabled = process.env.ADMIN_NOTIFICATION_ENABLED === 'true';
  if (!notificationsEnabled) {
    console.log('ℹ️ Admin notifications disabled');
    return;
  }

  const notificationMessage = formatNotificationMessage(data);

  // Log to console (always)
  console.log('\n' + '='.repeat(60));
  console.log('🚨 ADMIN ALERT - Order Requires Attention');
  console.log('='.repeat(60));
  console.log(notificationMessage);
  console.log('='.repeat(60) + '\n');

  // Future: Add email, Slack, Discord, or SMS notifications here
  // Example:
  // if (process.env.ADMIN_EMAIL) {
  //   await sendEmail({
  //     to: process.env.ADMIN_EMAIL,
  //     subject: `Order Alert: ${orderNumber}`,
  //     body: notificationMessage,
  //   });
  // }
}

/**
 * Formats notification message for admin
 */
function formatNotificationMessage(data: AdminNotificationData): string {
  const { orderNumber, customerName, email, totalPrice, analysis } = data;

  let message = `
📦 Order: ${orderNumber}
👤 Customer: ${customerName} (${email})
💰 Amount: ₦${totalPrice.toLocaleString()}

🤖 AI Analysis:
${analysis.summary}

📊 Classification:
- Customer Type: ${analysis.customerType.toUpperCase()}
- Risk Level: ${analysis.riskLevel.toUpperCase()}
- AI Confidence: ${(analysis.confidence * 100).toFixed(0)}%
`;

  if (analysis.riskFlags.length > 0) {
    message += `\n⚠️ Risk Flags:\n${analysis.riskFlags.map(flag => `  - ${flag}`).join('\n')}`;
  }

  if (analysis.riskLevel === 'high') {
    message += `\n\n🔴 ACTION REQUIRED: Review this order immediately!`;
  } else if (analysis.customerType === 'vip') {
    message += `\n\n⭐ VIP Customer: Consider priority processing and follow-up.`;
  }

  return message;
}

/**
 * Sends a test notification (for debugging)
 */
export async function sendTestNotification(): Promise<void> {
  await notifyAdmin({
    orderNumber: 'TEST-12345',
    customerName: 'Test Customer',
    email: 'test@example.com',
    totalPrice: 75000,
    analysis: {
      summary: 'This is a test notification to verify the admin alert system is working correctly.',
      customerType: 'vip',
      riskLevel: 'low',
      riskFlags: [],
      confidence: 1.0,
    },
  });
}
