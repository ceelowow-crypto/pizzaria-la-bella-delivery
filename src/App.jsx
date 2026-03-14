import { useState } from 'react'
import {
  House,
  Search,
  ShoppingCart,
  User,
  CircleCheck,
  Star,
  MapPin,
  Clock,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = ['Todos', 'Combos', 'Pizzas', 'Bebidas', 'Esfihas', 'Sobremesas']

const PRODUCTS = [
  {
    id: 1,
    name: 'Combo La Bella Individual',
    description:
      '1 Pizza Broto Tradicional (à sua escolha) + Esfiha Doce + Refrigerante (Lata 350 ml)',
    price: '27,00',
    originalPrice: '46,00',
    category: 'Combos',
    isPromo: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'Pizza Margherita Grande',
    description: 'Molho de tomate, mussarela, tomate fresco e manjericão. 8 fatias.',
    price: '49,90',
    originalPrice: '62,00',
    category: 'Pizzas',
    isPromo: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'Pizza Calabresa Especial',
    description: 'Molho de tomate, mussarela, calabresa fatiada e cebola. 8 fatias.',
    price: '52,90',
    originalPrice: null,
    category: 'Pizzas',
    isPromo: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
  },
  {
    id: 4,
    name: 'Combo Família',
    description:
      '1 Pizza Grande (à sua escolha) + 2 Refrigerantes (Lata 350ml) + Sobremesa',
    price: '89,90',
    originalPrice: '120,00',
    category: 'Combos',
    isPromo: true,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=200&h=200&fit=crop',
  },
  {
    id: 5,
    name: 'Refrigerante Lata 350ml',
    description: 'Coca-Cola, Guaraná Antarctica, Fanta Laranja ou Sprite. Gelado.',
    price: '6,00',
    originalPrice: null,
    category: 'Bebidas',
    isPromo: false,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop',
  },
  {
    id: 6,
    name: 'Esfiha de Carne',
    description: 'Esfiha recheada com carne moída temperada, cebola e especiarias. Unidade.',
    price: '5,50',
    originalPrice: null,
    category: 'Esfihas',
    isPromo: false,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
  },
]

// ─── Components ───────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=400&fit=crop"
        alt="Pizzaria La Bella"
        className="w-full h-full object-cover"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold text-white absolute top-4 left-4"
        style={{ backgroundColor: '#36D399' }}
      >
        • ABERTO AGORA
      </div>
    </div>
  )
}

function StoreInfo() {
  return (
    <div className="py-4 space-y-3">
      <div className="flex items-start gap-3">
        {/* Logo */}
        <div className="w-16 h-16 bg-card rounded-lg border-2 border-border flex items-center justify-center overflow-hidden flex-shrink-0">
          <span className="text-3xl">🍕</span>
        </div>

        {/* Info */}
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
  )
}

function PromoBanner() {
  return (
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
  )
}

function CategoryFilter({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full px-4 h-9 text-xs font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      }`}
    >
      {label}
    </button>
  )
}

function ProductCard({ product, onAdd }) {
  const { id, name, description, price, originalPrice, image, isPromo } = product

  return (
    <div className="bg-card rounded-xl border border-border hover:shadow-md transition-all">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Image */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isPromo && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 transform rotate-12">
              Promoção
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>

          {/* Prices */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-foreground">R$ {price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {originalPrice}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-1 sm:gap-2 mt-3">
            <a href={`/product/${id}`} className="flex-1 min-w-0" onClick={(e) => e.preventDefault()}>
              <button className="w-full inline-flex items-center justify-center h-9 px-4 text-xs font-medium uppercase border-2 border-primary text-primary rounded-xl bg-white transition-all hover:bg-primary/10">
                VER PRODUTO
              </button>
            </a>
            <button
              onClick={() => onAdd(product)}
              className="flex-1 inline-flex items-center justify-center h-9 px-4 text-xs font-medium uppercase bg-primary text-primary-foreground rounded-full transition-all hover:bg-primary/80"
            >
              + ADICIONAR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BottomNav({ cartCount, activeTab, setActiveTab }) {
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
              onClick={() => setActiveTab(id)}
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

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [activeTab, setActiveTab] = useState('home')
  const [cart, setCart] = useState([])

  const filtered =
    activeCategory === 'Todos'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory)

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="min-h-screen bg-background pb-20">
      <Hero />

      <div className="max-w-md mx-auto px-3 sm:px-4">
        <StoreInfo />
        <PromoBanner />

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-bold text-foreground mb-3">Categorias</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <CategoryFilter
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
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
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">
                Nenhum produto nesta categoria.
              </p>
            )}
          </div>
        </div>
      </div>

      <BottomNav cartCount={cartCount} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
