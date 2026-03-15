// Vercel Serverless Function — POST /api/criar-pix
// Proxies the SigiloPay PIX creation endpoint
// Keys are stored in Vercel environment variables (never exposed to frontend)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { identifier, amount, client, products } = req.body

  // Validate required fields
  if (!identifier || !amount || !client) {
    return res.status(400).json({ error: 'Missing required fields: identifier, amount, client' })
  }

  const PUBLIC_KEY = process.env.SIGILOPAY_PUBLIC_KEY
  const SECRET_KEY = process.env.SIGILOPAY_SECRET_KEY
  const WEBHOOK_URL = process.env.SIGILOPAY_WEBHOOK_URL || ''

  if (!PUBLIC_KEY || !SECRET_KEY) {
    return res.status(500).json({ error: 'SigiloPay API keys not configured' })
  }

  try {
    const response = await fetch('https://app.sigilopay.com.br/api/v1/gateway/pix/receive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': PUBLIC_KEY,
        'x-secret-key': SECRET_KEY,
      },
      body: JSON.stringify({
        identifier,
        amount,
        client: {
          name: client.name,
          email: client.email || `${identifier}@pedido.delivery`,
          phone: client.phone,
          document: client.document,
        },
        products: products || [],
        ...(WEBHOOK_URL ? { callbackUrl: WEBHOOK_URL } : {}),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('SigiloPay error:', data)
      return res.status(response.status).json({
        error: data.message || 'Erro ao criar cobrança PIX',
      })
    }

    // Return only what the frontend needs (never expose keys or internal data)
    return res.status(201).json({
      transactionId: data.transactionId,
      pix: {
        code: data.pix?.code || '',
        base64: data.pix?.base64 || '',
        image: data.pix?.image || '',
      },
      order: {
        id: data.order?.id || '',
        url: data.order?.url || '',
      },
    })
  } catch (error) {
    console.error('SigiloPay request failed:', error)
    return res.status(500).json({ error: 'Falha na comunicação com o gateway de pagamento' })
  }
}
