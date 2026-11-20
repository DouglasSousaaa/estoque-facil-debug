import test from 'node:test'
import assert from 'node:assert/strict'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from './productService.js'

const originalFetch = globalThis.fetch

function mockResponse(body = {}, ok = true, status = 200) {
  return { ok, status, json: async () => body }
}

test.afterEach(() => { globalThis.fetch = originalFetch })

test('GET /products lista os produtos', async () => {
  let request
  globalThis.fetch = async (url, options) => { request = { url, options }; return mockResponse([]) }
  assert.deepEqual(await getProducts(), [])
  assert.equal(request.url, 'http://localhost:3001/products')
  assert.deepEqual(request.options, {})
})

test('GET /products/:id consulta um produto', async () => {
  let requestedUrl
  globalThis.fetch = async (url) => { requestedUrl = url; return mockResponse({ id: 3 }) }
  assert.deepEqual(await getProductById(3), { id: 3 })
  assert.equal(requestedUrl, 'http://localhost:3001/products/3')
})

test('POST /products envia os dados em JSON', async () => {
  const product = { name: 'Cabo USB', category: 'Acessórios', price: 19.9, quantity: 4 }
  let request
  globalThis.fetch = async (url, options) => { request = { url, options }; return mockResponse({ id: 5, ...product }) }
  await createProduct(product)
  assert.equal(request.url, 'http://localhost:3001/products')
  assert.equal(request.options.method, 'POST')
  assert.deepEqual(JSON.parse(request.options.body), product)
})

test('PUT /products/:id atualiza o produto correto', async () => {
  const product = { name: 'Cabo USB', category: 'Acessórios', price: 20, quantity: 8 }
  let request
  globalThis.fetch = async (url, options) => { request = { url, options }; return mockResponse({ id: 5, ...product }) }
  await updateProduct(5, product)
  assert.equal(request.url, 'http://localhost:3001/products/5')
  assert.equal(request.options.method, 'PUT')
  assert.equal(JSON.parse(request.options.body).id, 5)
})

test('DELETE /products/:id exclui pelo identificador recebido', async () => {
  let request
  globalThis.fetch = async (url, options) => { request = { url, options }; return mockResponse({}) }
  await deleteProduct(7)
  assert.equal(request.url, 'http://localhost:3001/products/7')
  assert.equal(request.options.method, 'DELETE')
})

test('respostas HTTP de erro geram mensagem compreensível', async () => {
  globalThis.fetch = async () => mockResponse({}, false, 500)
  await assert.rejects(getProducts(), /HTTP 500/)
})

test('falha de conexão gera mensagem compreensível', async () => {
  globalThis.fetch = async () => { throw new TypeError('fetch failed') }
  await assert.rejects(getProducts(), /conectar à API/)
})
