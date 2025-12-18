import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define the expected AI response schema
const OrderAnalysisSchema = z.object({
  summary: z.string().describe('2-3 line summary of the order'),
  customerType: z.enum(['new', 'returning', 'vip']).describe('Customer classification'),
  riskLevel: z.enum(['low', 'medium', 'high']).describe('Fraud/risk assessment'),
  riskFlags: z.array(z.string()).describe('Specific risk indicators'),
  confidence: z.number().min(0).max(1).describe('Confidence score 0-1'),
});

export type OrderAnalysis = z.infer<typeof OrderAnalysisSchema>;

export interface OrderDataForAnalysis {
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  products: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  clerkUserId?: string;
  metadata?: any;
}

/**
 * Analyzes an order using OpenAI to classify customer type and detect risks
 */
export async function analyzeOrder(orderData: OrderDataForAnalysis): Promise<OrderAnalysis> {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not configured, skipping AI analysis');
      return getFallbackAnalysis();
    }

    // Prepare order context for AI
    const orderContext = `
Order Analysis Request:

Order Number: ${orderData.orderNumber}
Customer: ${orderData.customerName} (${orderData.email})
User ID: ${orderData.clerkUserId || 'Guest'}
Total Amount: ₦${orderData.totalPrice.toLocaleString()}

Products (${orderData.products.length} items):
${orderData.products.map(p => `- ${p.name} x${p.quantity} @ ₦${p.price}`).join('\n')}

Analyze this order and provide:
1. A brief 2-3 line summary
2. Customer classification (new/returning/vip based on user ID presence and order value)
3. Risk assessment (check for unusual patterns, high values, suspicious emails)
4. Specific risk flags if any concerns exist
5. Your confidence level in this analysis
`;

    console.log('🤖 Sending order to AI for analysis...');

    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: OrderAnalysisSchema,
      prompt: orderContext,
      system: `You are an e-commerce fraud detection and customer intelligence AI for IFYBEST store in Nigeria.
      
Your role:
- Summarize orders concisely
- Classify customers as: new (no user ID or first order), returning (has user ID), or vip (high value orders >₦50,000)
- Detect fraud risks: unusual email patterns, very high first orders, suspicious product combinations
- Be helpful but cautious - flag genuine concerns without false alarms

Respond with structured JSON matching the schema.`,
    });

    console.log('✅ AI analysis complete:', result.object);
    return result.object;

  } catch (error) {
    console.error('❌ AI analysis failed:', error);
    return getFallbackAnalysis();
  }
}

/**
 * Fallback analysis when AI is unavailable
 */
function getFallbackAnalysis(): OrderAnalysis {
  return {
    summary: 'Order received and processed successfully. AI analysis unavailable.',
    customerType: 'new',
    riskLevel: 'low',
    riskFlags: [],
    confidence: 0.5,
  };
}

/**
 * Determines if an order requires admin notification
 */
export function requiresAdminNotification(analysis: OrderAnalysis): boolean {
  return (
    analysis.riskLevel === 'high' ||
    analysis.customerType === 'vip' ||
    analysis.riskFlags.length > 0
  );
}
