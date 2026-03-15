// Vercel Serverless Function — GET /api/status-pix?id=TRANSACTION_ID
// Checks payment status via SigiloPay API

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Missing transaction id' })
  }

  const PUBLIC_KEY = process.env.SIGILOPAY_PUBLIC_KEY
  const SECRET_KEY = process.env.SIGILOPAY_SECRET_KEY

  if (!PUBLIC_KEY || !SECRET_KEY) {
    return res.status(500).json({ error: 'SigiloPay API keys not configured' })
  }

  try {
    const response = await fetch(
      `https://app.sigilopay.com.br/api/v1/gateway/transactions?id=${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: {
          'x-public-key': PUBLIC_KEY,
          'x-secret-key': SECRET_KEY,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || 'Erro ao consultar status',
      })
    }

    // Return only the status
    return res.status(200).json({
      status: data.status || data.transaction?.status || 'PENDING',
    })
  } catch (error) {
    console.error('SigiloPay status check failed:', error)
    return res.status(500).json({ error: 'Falha ao consultar status do pagamento' })
  }
}
