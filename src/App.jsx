import { useState, useEffect, useRef } from 'react'
import {
  House,
  Search,
  ShoppingCart,
  User,
  CircleCheck,
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Lock,
  ShoppingBag,
  Copy,
  Check,
  QrCode,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { createPixPayment, checkPixStatus, generateOrderId } from './api.js'

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ['Todos', 'Combos', 'Pizzas', 'Bebidas', 'Esfihas', 'Sobremesas']

const PRODUCTS = [
  {
    id: 1,
    name: 'Combo La Bella Individual',
    description:
      '1 Pizza Broto Tradicional (à sua escolha) + Esfiha Doce + Refrigerante (Lata 350 ml)',
    price: 27.0,
    originalPrice: 46.0,
    category: 'Combos',
    isPromo: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    options: [
      {
        title: 'Sabor',
        max: 1,
        items: [
          { name: 'Calabresa', extra: 0 },
          { name: 'Mussarela', extra: 0 },
          { name: 'Frango com Catupiry', extra: 0 },
          { name: 'Portuguesa', extra: 0 },
        ],
      },
      {
        title: 'Borda',
        max: 1,
        items: [
          { name: 'Sem borda recheada', extra: 0 },
          { name: 'Borda de Cheddar', extra: 6 },
          { name: 'Borda de Requeijão', extra: 8 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Pizza Margherita Grande',
    description: 'Molho de tomate, mussarela, tomate fresco e manjericão. 8 fatias.',
    price: 49.9,
    originalPrice: 62.0,
    category: 'Pizzas',
    isPromo: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
    options: [
      {
        title: 'Borda',
        max: 1,
        items: [
          { name: 'Sem borda recheada', extra: 0 },
          { name: 'Borda de Cheddar', extra: 6 },
          { name: 'Borda de Requeijão', extra: 8 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Pizza Calabresa Especial',
    description: 'Molho de tomate, mussarela, calabresa fatiada e cebola. 8 fatias.',
    price: 52.9,
    originalPrice: null,
    category: 'Pizzas',
    isPromo: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
    options: [
      {
        title: 'Borda',
        max: 1,
        items: [
          { name: 'Sem borda recheada', extra: 0 },
          { name: 'Borda de Cheddar', extra: 6 },
          { name: 'Borda de Requeijão', extra: 8 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Combo Família',
    description:
      '1 Pizza Grande (à sua escolha) + 2 Refrigerantes (Lata 350ml) + Sobremesa',
    price: 89.9,
    originalPrice: 120.0,
    category: 'Combos',
    isPromo: true,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=200&h=200&fit=crop',
    options: [
      {
        title: 'Sabor',
        max: 1,
        items: [
          { name: 'Calabresa', extra: 0 },
          { name: 'Mussarela', extra: 0 },
          { name: 'Frango com Catupiry', extra: 0 },
          { name: 'Portuguesa', extra: 0 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Refrigerante Lata 350ml',
    description: 'Coca-Cola, Guaraná Antarctica, Fanta Laranja ou Sprite. Gelado.',
    price: 6.0,
    originalPrice: null,
    category: 'Bebidas',
    isPromo: false,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop',
    options: [
      {
        title: 'Sabor',
        max: 1,
        items: [
          { name: 'Coca-Cola', extra: 0 },
          { name: 'Guaraná Antarctica', extra: 0 },
          { name: 'Fanta Laranja', extra: 0 },
          { name: 'Sprite', extra: 0 },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Esfiha de Carne',
    description: 'Esfiha recheada com carne moída temperada, cebola e especiarias. Unidade.',
    price: 5.5,
    originalPrice: null,
    category: 'Esfihas',
    isPromo: false,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
    options: [],
  },
]

function fmt(v) {
  return v.toFixed(2).replace('.', ',')
}

// ─── Shared Components ───────────────────────────────────────────────────────

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 bg-foreground text-white rounded-full flex items-center justify-center flex-shrink-0"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  )
}

function BottomNav({ cartCount, activeTab, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Início', Icon: House },
    { id: 'search', label: 'Buscar', Icon: Search },
    { id: 'cart', label: 'Carrinho', Icon: ShoppingCart },
    { id: 'account', label: 'Conta', Icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-14 sm:h-16">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-colors cursor-pointer ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm mt-1 font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ─── Page 1: Home ─────────────────────────────────────────────────────────────

function HomePage({ onViewProduct, onAddToCart, cart }) {
  const [activeCategory, setActiveCategory] = useState('Todos')

  const filtered =
    activeCategory === 'Todos'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=400&fit=crop"
          alt="Pizzaria La Bella"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold text-white absolute top-4 left-4"
          style={{ backgroundColor: '#36D399' }}
        >
          • ABERTO AGORA
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 sm:px-4">
        {/* Store Info */}
        <div className="py-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-card rounded-lg border-2 border-border flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-3xl">🍕</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Pizzaria La Bella</h1>
                <CircleCheck className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span>(3.265)</span>
                </div>
                <span>•</span>
                <span>Min R$ 27,00</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>1,6km</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Clock className="h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">40-60 min</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-green-500 font-medium">Grátis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-red-500 text-white rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-base">Promoção: Pague 1 Leve 2</h3>
              <p className="text-sm opacity-90">
                Aproveite nossos combos especiais com desconto!
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-bold text-foreground mb-3">Categorias</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center justify-center rounded-full px-4 h-9 text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground mb-3">
            {activeCategory === 'Todos' ? 'Cardápio' : activeCategory}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-card rounded-xl border border-border hover:shadow-md transition-all"
                >
                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {product.isPromo && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 transform rotate-12">
                          Promoção
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-foreground">
                          R$ {fmt(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {fmt(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 sm:gap-2 mt-3">
                        <button
                          onClick={() => onViewProduct(product)}
                          className="flex-1 min-w-0 w-full inline-flex items-center justify-center h-9 px-4 text-xs font-medium uppercase border-2 border-primary text-primary rounded-xl bg-white transition-all hover:bg-primary/10"
                        >
                          VER PRODUTO
                        </button>
                        <button
                          onClick={() => onAddToCart(product, 1)}
                          className="flex-1 inline-flex items-center justify-center h-9 px-4 text-xs font-medium uppercase bg-primary text-primary-foreground rounded-full transition-all hover:bg-primary/80"
                        >
                          + ADICIONAR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">
                Nenhum produto nesta categoria.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Page 2: Product Detail ──────────────────────────────────────────────────

function ProductPage({ product, onBack, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [selections, setSelections] = useState({})
  const [observation, setObservation] = useState('')

  const extrasTotal = Object.values(selections).reduce((sum, sel) => {
    return sum + sel.reduce((s, item) => s + item.extra * item.qty, 0)
  }, 0)
  const totalPrice = (product.price + extrasTotal) * quantity

  function updateSelection(sectionTitle, itemName, extra, delta) {
    setSelections((prev) => {
      const section = prev[sectionTitle] || []
      const existing = section.find((s) => s.name === itemName)
      const optionDef = product.options.find((o) => o.title === sectionTitle)
      const currentTotal = section.reduce((s, i) => s + i.qty, 0)

      if (delta > 0 && currentTotal >= optionDef.max) return prev

      if (existing) {
        const newQty = Math.max(0, existing.qty + delta)
        if (newQty === 0) {
          return { ...prev, [sectionTitle]: section.filter((s) => s.name !== itemName) }
        }
        return {
          ...prev,
          [sectionTitle]: section.map((s) =>
            s.name === itemName ? { ...s, qty: newQty } : s
          ),
        }
      } else if (delta > 0) {
        return { ...prev, [sectionTitle]: [...section, { name: itemName, extra, qty: 1 }] }
      }
      return prev
    })
  }

  function getQty(sectionTitle, itemName) {
    const section = selections[sectionTitle] || []
    const item = section.find((s) => s.name === itemName)
    return item ? item.qty : 0
  }

  function handleAdd() {
    onAddToCart(product, quantity, selections, observation)
    onBack()
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="max-w-md mx-auto px-3 sm:px-4 py-3">
          <BackButton onClick={onBack} />
        </div>
      </div>

      {/* Product image */}
      <div className="relative w-full h-64 bg-muted flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="max-w-md mx-auto px-3 sm:px-4 py-6 space-y-6">
        {/* Title & price */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-baseline gap-2 mb-4">
            {product.originalPrice && (
              <>
                <span className="text-sm text-muted-foreground">de</span>
                <span className="text-lg text-muted-foreground line-through">
                  R$ {fmt(product.originalPrice)}
                </span>
                <span className="text-sm text-muted-foreground">por</span>
              </>
            )}
            <span className="text-xl sm:text-2xl font-bold text-primary">
              R$ {fmt(product.price)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className="w-full h-12 px-8 font-medium bg-primary/90 text-white rounded-xl inline-flex items-center justify-center gap-2 transition-all hover:bg-primary"
          >
            + ADICIONAR - R$ {fmt(totalPrice)}
          </button>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-bold text-base">Descrição</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Options sections */}
        {product.options.map((option) => {
          const sectionTotal = (selections[option.title] || []).reduce(
            (s, i) => s + i.qty,
            0
          )
          return (
            <div key={option.title} className="bg-secondary rounded-xl p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{option.title}:</h3>
                  <span className="text-sm text-muted-foreground">
                    {sectionTotal}/{option.max}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Escolha até {option.max} opção(ões)
                </p>
              </div>
              {option.items.map((item) => {
                const qty = getQty(option.title, item.name)
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between bg-background rounded-lg p-3"
                  >
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      {item.extra > 0 && (
                        <span className="text-sm text-primary ml-2">
                          +R$ {fmt(item.extra)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateSelection(option.title, item.name, item.extra, -1)
                        }
                        className="inline-flex items-center justify-center rounded-lg w-8 h-8 border-2 border-primary text-primary bg-white transition-all hover:bg-primary/10"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-medium">{qty}</span>
                      <button
                        onClick={() =>
                          updateSelection(option.title, item.name, item.extra, 1)
                        }
                        className="inline-flex items-center justify-center rounded-lg w-8 h-8 border-2 border-primary text-primary bg-white transition-all hover:bg-primary/10"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Quantity */}
        <div className="bg-secondary rounded-xl p-4 space-y-4">
          <h3 className="font-bold">Quantidade</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="inline-flex items-center justify-center rounded-lg w-13 h-9 border-2 border-primary text-primary bg-white transition-all hover:bg-primary/10"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="inline-flex items-center justify-center rounded-lg w-13 h-9 border-2 border-primary bg-primary text-white transition-all hover:bg-primary/80"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-xl font-bold text-primary">R$ {fmt(totalPrice)}</div>
            </div>
          </div>
        </div>

        {/* Observations */}
        <div className="bg-secondary rounded-xl p-4 space-y-4">
          <h3 className="font-bold">Observações</h3>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Adicionar algum detalhe?"
            className="w-full bg-white border border-border rounded-xl p-3 text-base text-foreground resize-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
            rows="3"
          />
        </div>

        {/* Bottom CTA */}
        <button
          onClick={handleAdd}
          className="w-full h-12 px-8 font-medium bg-primary text-white rounded-xl inline-flex items-center justify-center gap-2 transition-all hover:bg-primary/80"
        >
          + ADICIONAR - R$ {fmt(totalPrice)}
        </button>
      </div>
    </div>
  )
}

// ─── Page 3: Cart ─────────────────────────────────────────────────────────────

function CartPage({ cart, setCart, onBack, onCheckout, onViewProduct, onAddToCart }) {
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)

  function updateQty(idx, delta) {
    setCart((prev) => {
      const newCart = [...prev]
      newCart[idx] = { ...newCart[idx], qty: Math.max(0, newCart[idx].qty + delta) }
      newCart[idx].totalPrice =
        (newCart[idx].unitPrice) * newCart[idx].qty
      return newCart.filter((item) => item.qty > 0)
    })
  }

  function removeItem(idx) {
    setCart((prev) => prev.filter((_, i) => i !== idx))
  }

  const suggestedProducts = PRODUCTS.filter(
    (p) => !cart.find((c) => c.id === p.id)
  ).slice(0, 3)

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton onClick={onBack} />
            <h1 className="text-xl font-bold">Seu Carrinho</h1>
          </div>
          {cartCount > 0 && (
            <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold text-sm">
              {cartCount}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 sm:px-4 py-4 space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
            <button
              onClick={onBack}
              className="h-9 px-6 text-sm font-medium bg-primary text-white rounded-full transition-all hover:bg-primary/80"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-4 flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    R$ {fmt(item.totalPrice)}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(idx, -1)}
                        className="inline-flex items-center justify-center rounded-xl w-8 h-8 border-2 border-primary text-primary bg-white transition-all hover:bg-primary/10"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(idx, 1)}
                        className="inline-flex items-center justify-center rounded-xl w-8 h-8 border-2 border-primary text-primary bg-white transition-all hover:bg-primary/10"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-destructive p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">R$ {fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entrega</span>
                <span className="font-medium text-green-500">Grátis</span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-primary">R$ {fmt(subtotal)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={onCheckout}
              className="w-full h-12 px-8 font-medium text-base bg-primary text-white rounded-xl inline-flex items-center justify-center gap-2 transition-all hover:bg-primary/80"
            >
              <CreditCard className="h-4 w-4" />
              Finalizar
            </button>

            {/* Complete your order */}
            {suggestedProducts.length > 0 && (
              <div className="pt-6 border-t border-border space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-lg">Complete seu pedido</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {suggestedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-card rounded-xl border border-border hover:shadow-md transition-all"
                    >
                      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-foreground">
                              R$ {fmt(product.price)}
                            </span>
                          </div>
                          <div className="flex gap-1 sm:gap-2 mt-3">
                            <button
                              onClick={() => onViewProduct(product)}
                              className="flex-1 min-w-0 w-full inline-flex items-center justify-center h-9 px-4 text-xs font-medium uppercase border-2 border-primary text-primary rounded-xl bg-white transition-all hover:bg-primary/10"
                            >
                              VER PRODUTO
                            </button>
                            <button
                              onClick={() => onAddToCart(product, 1)}
                              className="flex-1 inline-flex items-center justify-center h-9 px-4 text-xs font-medium uppercase bg-primary text-primary-foreground rounded-full transition-all hover:bg-primary/80"
                            >
                              + ADICIONAR
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page 4: Checkout ─────────────────────────────────────────────────────────

function CheckoutPage({ cart, onBack, onConfirm }) {
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    cep: '',
    address: '',
    number: '',
    neighborhood: '',
    reference: '',
    deliveryOption: 'free',
  })
  const [showAddress, setShowAddress] = useState(false)

  const deliveryFee = form.deliveryOption === 'fast' ? 6.13 : 0
  const total = subtotal + deliveryFee

  function handleCepChange(v) {
    const clean = v.replace(/\D/g, '').slice(0, 8)
    const formatted = clean.length > 5 ? clean.slice(0, 5) + '-' + clean.slice(5) : clean
    setForm((f) => ({ ...f, cep: formatted }))
    if (clean.length === 8) {
      setShowAddress(true)
    }
  }

  function handlePhoneChange(v) {
    const clean = v.replace(/\D/g, '').slice(0, 11)
    let formatted = clean
    if (clean.length > 6) {
      formatted = `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
    } else if (clean.length > 2) {
      formatted = `(${clean.slice(0, 2)}) ${clean.slice(2)}`
    }
    setForm((f) => ({ ...f, phone: formatted }))
  }

  function handleDocumentChange(v) {
    const clean = v.replace(/\D/g, '').slice(0, 11)
    let formatted = clean
    if (clean.length > 9) {
      formatted = `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`
    } else if (clean.length > 6) {
      formatted = `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`
    } else if (clean.length > 3) {
      formatted = `${clean.slice(0, 3)}.${clean.slice(3)}`
    }
    setForm((f) => ({ ...f, document: formatted }))
  }

  const isValid =
    form.name &&
    form.email &&
    form.phone.replace(/\D/g, '').length >= 10 &&
    form.document.replace(/\D/g, '').length === 11 &&
    form.cep.replace(/\D/g, '').length === 8

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-md mx-auto px-3 sm:px-4 py-3 flex items-center gap-3">
          <BackButton onClick={onBack} />
          <Lock className="h-5 w-5 text-foreground" />
          <h1 className="text-lg sm:text-xl font-bold">Finalizar Pedido</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 sm:px-4 py-4 space-y-4">
        {/* Order summary */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-bold">Resumo do Pedido</h2>
          </div>
          <div className="space-y-2">
            {cart.map((item, idx) => (
              <div key={idx} className="text-sm">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="text-foreground">
                  {' '}
                  ({item.qty}x) - R$ {fmt(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Subtotal: </span>
            <span className="font-bold text-green-500">R$ {fmt(subtotal)}</span>
          </div>
        </div>

        {/* Delivery info form */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-5 w-5" />
            <h2 className="font-bold">Informações de Entrega</h2>
          </div>

          <div>
            <label className="text-sm font-medium leading-none block mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Nome Completo"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium leading-none block mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium leading-none block mb-2">
              CPF
            </label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={form.document}
              onChange={(e) => handleDocumentChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium leading-none block mb-2">
              Celular (WhatsApp)
            </label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={form.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium leading-none block mb-2">CEP</label>
            <input
              type="text"
              placeholder="00000-000"
              value={form.cep}
              onChange={(e) => handleCepChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        {/* Full address (shown after CEP) */}
        {showAddress && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <h2 className="font-bold">Endereço Completo</h2>
            </div>

            <div>
              <label className="text-sm font-medium leading-none block mb-2">
                Endereço
              </label>
              <input
                type="text"
                placeholder="Rua Exemplo"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium leading-none block mb-2">
                  Número
                </label>
                <input
                  type="text"
                  placeholder="123"
                  value={form.number}
                  onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium leading-none block mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  placeholder="Centro"
                  value={form.neighborhood}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, neighborhood: e.target.value }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium leading-none block mb-2">
                Ponto de Referência
              </label>
              <input
                type="text"
                placeholder="Próximo ao mercado"
                value={form.reference}
                onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        )}

        {/* Delivery options */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-5 w-5" />
            <h2 className="font-bold">Opções de Entrega</h2>
          </div>

          <label
            className={`border rounded-lg p-4 cursor-pointer transition-colors block ${
              form.deliveryOption === 'free'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                value="free"
                checked={form.deliveryOption === 'free'}
                onChange={() => setForm((f) => ({ ...f, deliveryOption: 'free' }))}
                className="accent-primary"
              />
              <div>
                <p className="font-semibold">Entrega Grátis</p>
                <p className="text-sm text-muted-foreground">40-60 min • Grátis</p>
              </div>
            </div>
          </label>

          <label
            className={`border rounded-lg p-4 cursor-pointer transition-colors block ${
              form.deliveryOption === 'fast'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="delivery"
                value="fast"
                checked={form.deliveryOption === 'fast'}
                onChange={() => setForm((f) => ({ ...f, deliveryOption: 'fast' }))}
                className="accent-primary"
              />
              <div>
                <p className="font-semibold">Entrega Rápida</p>
                <p className="text-sm text-muted-foreground">
                  20-30 min • R$ {fmt(6.13)}
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Trust badges */}
        <div className="space-y-4">
          <div className="bg-accent rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                RA
              </div>
              <div className="flex-1">
                <h3 className="font-bold">Reclame Aqui</h3>
                <p className="text-sm text-muted-foreground">
                  O consumidor avaliou o atendimento dessa empresa como{' '}
                  <span className="font-bold text-foreground">ÓTIMO</span>. A nota média
                  nos últimos 6 meses é{' '}
                  <span className="font-bold text-foreground">9.9/10</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total summary */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">R$ {fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Entrega</span>
            <span className="font-medium text-green-500">
              {deliveryFee > 0 ? `R$ ${fmt(deliveryFee)}` : 'Grátis'}
            </span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between">
            <span className="font-bold">Total</span>
            <span className="text-xl font-bold text-primary">R$ {fmt(total)}</span>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={() => isValid && onConfirm(form, total)}
          disabled={!isValid}
          className={`w-full h-12 px-8 font-medium text-base text-white rounded-xl inline-flex items-center justify-center gap-2 transition-all ${
            isValid
              ? 'bg-primary hover:bg-primary/80'
              : 'bg-primary/50 cursor-not-allowed'
          }`}
        >
          <Lock className="h-4 w-4" />
          Confirmar Pedido - R$ {fmt(total)}
        </button>
      </div>
    </div>
  )
}

// ─── Page 5: PIX Payment ──────────────────────────────────────────────────────

function PixPage({ total, customerData, cart, onBack }) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [pixData, setPixData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('PENDING') // PENDING | COMPLETED
  const pollingRef = useRef(null)

  // Fallback PIX code for demo/when API is not available
  const fallbackPixCode =
    '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540' +
    total.toFixed(2) +
    '5802BR5925PIZZARIA LA BELLA LTDA6009SAO PAULO62070503***6304'

  // Create PIX payment on mount
  useEffect(() => {
    let cancelled = false

    async function initPayment() {
      try {
        setLoading(true)
        setError(null)

        const orderId = generateOrderId()
        const products = cart.map((item) => ({
          id: String(item.id),
          name: item.name,
          quantity: item.qty,
          price: item.unitPrice,
        }))

        const result = await createPixPayment({
          identifier: orderId,
          amount: total,
          client: {
            name: customerData?.name || 'Cliente',
            email: customerData?.email || 'cliente@email.com',
            phone: customerData?.phone || '(00) 00000-0000',
            document: customerData?.document || '000.000.000-00',
          },
          products,
        })

        if (!cancelled) {
          setPixData(result)
          setLoading(false)
          // Start polling for payment confirmation
          startPolling(result.transactionId)
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('SigiloPay API not available, using demo mode:', err.message)
          setPixData(null)
          setLoading(false)
          // In demo mode, no polling
        }
      }
    }

    initPayment()

    return () => {
      cancelled = true
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  // Poll for payment status (fallback to webhooks in production)
  function startPolling(transactionId) {
    pollingRef.current = setInterval(async () => {
      try {
        const result = await checkPixStatus(transactionId)
        if (result.status === 'COMPLETED') {
          setPaymentStatus('COMPLETED')
          clearInterval(pollingRef.current)
        } else if (result.status === 'CANCELED') {
          setPaymentStatus('CANCELED')
          clearInterval(pollingRef.current)
        }
      } catch {
        // Silently continue polling
      }
    }, 5000) // Check every 5 seconds
  }

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) {
          clearInterval(timer)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const pixCode = pixData?.pix?.code || fallbackPixCode
  const qrCodeImage = pixData?.pix?.base64 || pixData?.pix?.image || null

  function handleCopy() {
    navigator.clipboard.writeText(pixCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  // Payment confirmed screen
  if (paymentStatus === 'COMPLETED') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="max-w-md mx-auto px-3 sm:px-4 py-3 flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold">Pagamento Confirmado</h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-3 sm:px-4 py-16 text-center space-y-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Pagamento Confirmado!</h2>
          <p className="text-muted-foreground">
            Seu pedido foi recebido e está sendo preparado. Você receberá atualizações
            pelo WhatsApp.
          </p>
          <div className="bg-accent rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              Tempo estimado de entrega:{' '}
              <span className="font-bold text-foreground">40-60 minutos</span>
            </p>
          </div>
          <button
            onClick={onBack}
            className="h-12 px-8 font-medium text-base bg-primary text-white rounded-xl inline-flex items-center justify-center gap-2 transition-all hover:bg-primary/80"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-md mx-auto px-3 sm:px-4 py-3 flex items-center gap-3">
          <BackButton onClick={onBack} />
          <h1 className="text-lg sm:text-xl font-bold">Pagamento PIX</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 sm:px-4 py-6 space-y-6">
        {/* Timer */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-bold">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Tempo restante para realizar o pagamento
          </p>
        </div>

        {/* Amount */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Valor a pagar</p>
          <p className="text-3xl font-bold text-primary">R$ {fmt(total)}</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          {loading ? (
            <div className="w-48 h-48 border-2 border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          ) : qrCodeImage ? (
            <div className="w-48 h-48 border-2 border-gray-200 rounded-xl overflow-hidden bg-white p-2">
              <img
                src={qrCodeImage}
                alt="QR Code PIX"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-48 h-48 border-2 border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
              <QrCode className="h-32 w-32 text-foreground" />
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <h3 className="font-bold text-center">Como pagar com PIX</h3>
          {[
            'Abra o app do seu banco',
            'Escolha pagar via PIX / QR Code',
            'Escaneie o QR Code ou copie o código',
            'Confirme o pagamento',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-sm text-muted-foreground pt-1">{step}</p>
            </div>
          ))}
        </div>

        {/* PIX code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Código PIX (Copia e Cola)</label>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <p className="text-xs text-muted-foreground break-all font-mono leading-relaxed">
              {pixCode}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`w-full h-12 px-8 font-medium text-base rounded-xl inline-flex items-center justify-center gap-2 transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-primary text-white hover:bg-primary/80'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Código Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar Código PIX
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="bg-accent rounded-xl p-4">
          <p className="text-sm text-muted-foreground text-center">
            Após o pagamento, você receberá a confirmação pelo WhatsApp. O pedido será
            preparado assim que o pagamento for confirmado.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── App Router ───────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState('home') // home | product | cart | checkout | pix
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [pixTotal, setPixTotal] = useState(0)
  const [customerData, setCustomerData] = useState(null)

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  function addToCart(product, qty = 1, selections = {}, observation = '') {
    const extrasTotal = Object.values(selections).reduce((sum, sel) => {
      return sum + sel.reduce((s, item) => s + item.extra * item.qty, 0)
    }, 0)
    const unitPrice = product.price + extrasTotal

    setCart((prev) => {
      // Always add as new item (different selections = different item)
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          unitPrice,
          qty,
          totalPrice: unitPrice * qty,
          selections,
          observation,
        },
      ]
    })
  }

  function handleViewProduct(product) {
    setSelectedProduct(product)
    setPage('product')
    window.scrollTo(0, 0)
  }

  function handleNavigation(tab) {
    if (tab === 'cart') {
      setPage('cart')
    } else if (tab === 'home') {
      setPage('home')
    }
    window.scrollTo(0, 0)
  }

  const showBottomNav = page === 'home'

  return (
    <div className="min-h-screen bg-background">
      {page === 'home' && (
        <div className="pb-20">
          <HomePage
            onViewProduct={handleViewProduct}
            onAddToCart={(p, qty) => addToCart(p, qty)}
            cart={cart}
          />
        </div>
      )}

      {page === 'product' && selectedProduct && (
        <ProductPage
          product={selectedProduct}
          onBack={() => {
            setPage('home')
            window.scrollTo(0, 0)
          }}
          onAddToCart={addToCart}
        />
      )}

      {page === 'cart' && (
        <CartPage
          cart={cart}
          setCart={setCart}
          onBack={() => {
            setPage('home')
            window.scrollTo(0, 0)
          }}
          onCheckout={() => {
            setPage('checkout')
            window.scrollTo(0, 0)
          }}
          onViewProduct={handleViewProduct}
          onAddToCart={(p, qty) => addToCart(p, qty)}
        />
      )}

      {page === 'checkout' && (
        <CheckoutPage
          cart={cart}
          onBack={() => {
            setPage('cart')
            window.scrollTo(0, 0)
          }}
          onConfirm={(form, total) => {
            setPixTotal(total)
            setCustomerData(form)
            setPage('pix')
            window.scrollTo(0, 0)
          }}
        />
      )}

      {page === 'pix' && (
        <PixPage
          total={pixTotal}
          customerData={customerData}
          cart={cart}
          onBack={() => {
            setPage('home')
            setCart([])
            setCustomerData(null)
            window.scrollTo(0, 0)
          }}
        />
      )}

      {showBottomNav && (
        <BottomNav
          cartCount={cartCount}
          activeTab="home"
          onNavigate={handleNavigation}
        />
      )}
    </div>
  )
}
