const API_URL = 'http://localhost:3001'

// Centraliza as requisições e transforma respostas HTTP inválidas em erros legíveis.
async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, options)
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o JSON Server está em execução.')
  }

  if (!response.ok) {
    if (response.status === 404) throw new Error('Produto ou recurso não encontrado.')
    throw new Error(`A API retornou um erro (HTTP ${response.status}). Tente novamente.`)
  }

  if (response.status === 204) return null
  return response.json()
}

export async function getProducts() {
  return request('/products')
}

export async function getProductById(id) {
  return request(`/products/${encodeURIComponent(id)}`)
}

export async function createProduct(product) {
  return request('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
}

export async function updateProduct(id, product) {
  return request(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product, id }),
  })
}

export async function deleteProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
