import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Cart context — holds items, quantities, and the drawer's open state.
 * Persisted to sessionStorage so a page refresh doesn't wipe the cart
 * during a single visit.
 *
 * Cart items are shape { id, quantity }. The full ticket record is looked
 * up from the tickets catalog at render time so we always render the
 * current name/price/copy rather than a stale snapshot.
 */

const STORAGE_KEY = 'landmark:cart-v1'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* quota exceeded — non-fatal, just skip persistence */
    }
  }, [items])

  const addItem = useCallback((id, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { id, quantity: qty }]
    })
    setOpen(true)
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const setQuantity = useCallback((id, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalCount,
      open,
      setOpen,
    }),
    [items, addItem, removeItem, setQuantity, clear, totalCount, open]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

/**
 * Format a Naira amount (numeric or numeric string) as ₦X,XXX.
 * Returns the passed value as-is if it's already a formatted string.
 */
export function formatNaira(amount) {
  if (amount == null) return ''
  const n = Number(amount)
  if (Number.isNaN(n)) return String(amount)
  return `₦${n.toLocaleString('en-NG')}`
}
