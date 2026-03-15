// ─── SigiloPay API Integration ───────────────────────────────────────────────
//
// IMPORTANT: In production, these calls MUST go through YOUR backend.
// Never expose x-public-key / x-secret-key in the frontend.
//
// Your backend should have:
//   POST /api/criar-pix     → calls SigiloPay and returns QR Code to frontend
//   POST /api/webhook       → receives SigiloPay webhook notifications
//
// This file calls YOUR backend proxy, not SigiloPay directly.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

/**
 * Create a PIX payment via your backend proxy.
 *
 * Your backend (e.g. POST /api/criar-pix) should:
 *   1. Call SigiloPay: POST https://app.sigilopay.com.br/api/v1/gateway/pix/receive
 *      with headers: x-public-key + x-secret-key
 *   2. Return the pix object { code, base64, image } + transactionId to frontend
 *
 * @param {Object} params
 * @param {string} params.identifier - Unique order ID from your system
 * @param {number} params.amount - Total amount in BRL (e.g. 27.00)
 * @param {Object} params.client - { name, email, phone, document }
 * @param {Array}  params.products - [{ id, name, quantity, price }]
 * @returns {Promise<{
 *   transactionId: string,
 *   pix: { code: string, base64: string, image: string },
 *   order: { id: string, url: string, receiptUrl: string }
 * }>}
 */
export async function createPixPayment({ identifier, amount, client, products = [] }) {
  const response = await fetch(`${API_BASE}/criar-pix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier,
      amount,
      client,
      products,
      // callbackUrl is set by the backend, not frontend
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Erro ao criar pagamento PIX')
  }

  return response.json()
}

/**
 * Check payment status (optional polling fallback).
 * Prefer webhooks for real-time — use this only for UI polling.
 *
 * Your backend (e.g. GET /api/status-pix?id=XXX) should:
 *   1. Call SigiloPay: GET https://app.sigilopay.com.br/api/v1/gateway/transactions?id=XXX
 *      or ?clientIdentifier=YOUR_ORDER_ID
 *   2. Return { status: 'PENDING' | 'COMPLETED' | 'CANCELED' }
 *
 * @param {string} transactionId
 * @returns {Promise<{ status: string }>}
 */
export async function checkPixStatus(transactionId) {
  const response = await fetch(
    `${API_BASE}/status-pix?id=${encodeURIComponent(transactionId)}`
  )

  if (!response.ok) {
    throw new Error('Erro ao consultar status do pagamento')
  }

  return response.json()
}

/**
 * Generate a unique order identifier for SigiloPay.
 * @returns {string}
 */
export function generateOrderId() {
  return `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
