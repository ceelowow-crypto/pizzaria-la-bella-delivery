// Vercel Serverless Function — POST /api/webhook
// Receives SigiloPay webhook notifications (TRANSACTION_PAID, etc.)
// Configure this URL as callbackUrl in your SigiloPay payments

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { event, token, transaction } = req.body

  console.log(`[Webhook] Event: ${event}, Transaction: ${transaction?.id}, Identifier: ${transaction?.identifier}, Status: ${transaction?.status}`)

  // Handle different events
  switch (event) {
    case 'TRANSACTION_PAID':
      // Payment confirmed! Update your order status here.
      // Use transaction.identifier to match your order ID.
      console.log(`[Webhook] Payment CONFIRMED for order: ${transaction?.identifier}`)
      console.log(`[Webhook] Amount: R$ ${transaction?.amount}`)
      console.log(`[Webhook] Paid at: ${transaction?.payedAt}`)

      // TODO: In production, update your database here:
      // await db.orders.update({ identifier: transaction.identifier }, { status: 'PAID' })
      // await sendWhatsAppNotification(transaction.identifier)
      break

    case 'TRANSACTION_CREATED':
      console.log(`[Webhook] Transaction created: ${transaction?.identifier}`)
      break

    case 'TRANSACTION_CANCELED':
      console.log(`[Webhook] Transaction canceled: ${transaction?.identifier}`)
      break

    case 'TRANSACTION_REFUNDED':
      console.log(`[Webhook] Transaction refunded: ${transaction?.identifier}`)
      break

    default:
      console.log(`[Webhook] Unknown event: ${event}`)
  }

  // Always return 200 to acknowledge receipt
  return res.status(200).json({ received: true })
}
