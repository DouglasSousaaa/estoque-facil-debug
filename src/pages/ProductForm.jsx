import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createProduct, getProductById, updateProduct } from '../services/productService'

const initialForm = { name: '', category: '', price: '', quantity: '' }

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) {
      setForm(initialForm)
      setLoading(false)
      return
    }

    let cancelled = false
    async function loadProduct() {
      setLoading(true)
      setError('')
      try {
        const product = await getProductById(id)
        if (!product) throw new Error('Produto não encontrado.')
        if (!cancelled) {
          setForm({
            name: product.name ?? '',
            category: product.category ?? '',
            price: String(product.price ?? ''),
            quantity: String(product.quantity ?? ''),
          })
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Erro ao buscar produto.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProduct()
    return () => { cancelled = true }
  }, [id, isEditing])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const name = form.name.trim()
    const category = form.category.trim()
    const price = Number(form.price)
    const quantity = Number(form.quantity)

    if (!name || !category) {
      setError('Preencha o nome e a categoria do produto.')
      return
    }
    if (form.price.trim() === '' || !Number.isFinite(price) || price < 0) {
      setError('Informe um preço numérico válido e não negativo.')
      return
    }
    if (form.quantity.trim() === '' || !Number.isInteger(quantity) || quantity < 0) {
      setError('Informe uma quantidade inteira válida e não negativa.')
      return
    }

    const product = { name, category, price, quantity }

    setSaving(true)
    try {
      if (isEditing) {
        await updateProduct(id, product)
      } else {
        await createProduct(product)
      }
      navigate('/products')
    } catch (err) {
      setError(err.message || 'Erro ao salvar produto.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="feedback">Carregando dados do produto...</p>

  return (
    <section className="form-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{isEditing ? 'EDIÇÃO' : 'CADASTRO'}</span>
          <h2>{isEditing ? 'Editar produto' : 'Novo produto'}</h2>
          <p>Preencha os dados para manter o estoque atualizado.</p>
        </div>
      </div>

      {error && <div className="alert error" role="alert">{error}</div>}

      <form className="product-form" onSubmit={handleSubmit} noValidate>
        <label>
          Nome do produto
          <input name="name" value={form.name} onChange={handleChange} placeholder="Ex.: Teclado mecânico" required maxLength="100" />
        </label>

        <label>
          Categoria
          <input name="category" value={form.category} onChange={handleChange} placeholder="Ex.: Periféricos" required maxLength="60" />
        </label>

        <div className="form-row">
          <label>
            Preço (R$)
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0,00" required />
          </label>
          <label>
            Quantidade
            <input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={handleChange} placeholder="0" required />
          </label>
        </div>

        <div className="form-actions">
          <Link className="button secondary" to="/products">Cancelar</Link>
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
        </div>
      </form>
    </section>
  )
}
