import type { OrderStatus, PaymentMethod } from "@/lib/order";

export type CustomerCartFood = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

export type CustomerCartItem = CustomerCartFood & {
  note: string;
  quantity: number;
};

export type CustomerOrderStatus = OrderStatus;

export type CustomerOrder = {
  id: string;
  adminFee: number;
  createdAt: string;
  databaseId?: string;
  expiryAt: string;
  completedAt?: string;
  items: CustomerCartItem[];
  paidAt?: string;
  paymentMethod: PaymentMethod;
  status: CustomerOrderStatus;
  subtotal: number;
  tableId: string;
  tableNumber: string;
  tax: number;
  total: number;
};

const cartPrefix = "payoy:cart:";
const orderPrefix = "payoy:order:";
const cartChangeEvent = "payoy:cart-change";
const orderChangeEvent = "payoy:order-change";
const emptyCartItems: CustomerCartItem[] = [];

const cartCache = new Map<
  string,
  { raw: string | null; value: CustomerCartItem[] }
>();
const orderCache = new Map<
  string,
  { raw: string | null; value: CustomerOrder | null }
>();

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function getCartKey(tableId: string) {
  return `${cartPrefix}${tableId}`;
}

function getOrderKey(tableId: string) {
  return `${orderPrefix}${tableId}`;
}

function dispatchCartChange(tableId: string) {
  window.dispatchEvent(new CustomEvent(cartChangeEvent, { detail: { tableId } }));
}

function dispatchOrderChange(tableId: string) {
  window.dispatchEvent(new CustomEvent(orderChangeEvent, { detail: { tableId } }));
}

function subscribeToStorageKey(
  eventName: string,
  key: string,
  tableId: string,
  callback: () => void
) {
  if (!canUseStorage()) {
    return () => {};
  }

  function handleCustomEvent(event: Event) {
    const detail = (event as CustomEvent<{ tableId?: string }>).detail;

    if (detail?.tableId === tableId) {
      callback();
    }
  }

  function handleStorageEvent(event: StorageEvent) {
    if (event.key === key) {
      callback();
    }
  }

  window.addEventListener(eventName, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(eventName, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

function normalizeItem(item: Partial<CustomerCartItem>): CustomerCartItem | null {
  if (!item.id || !item.name || typeof item.price !== "number") {
    return null;
  }

  return {
    description: item.description ?? "",
    id: item.id,
    imageUrl: item.imageUrl ?? "",
    name: item.name,
    note: item.note ?? "",
    price: item.price,
    quantity: Math.max(1, Number(item.quantity) || 1),
  };
}

export function getCartItems(tableId: string): CustomerCartItem[] {
  if (!canUseStorage()) {
    return emptyCartItems;
  }

  const raw = localStorage.getItem(getCartKey(tableId));
  const cached = cartCache.get(tableId);

  if (cached?.raw === raw) {
    return cached.value;
  }

  if (!raw) {
    cartCache.set(tableId, { raw, value: emptyCartItems });
    return emptyCartItems;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      cartCache.set(tableId, { raw, value: emptyCartItems });
      return emptyCartItems;
    }

    const value =
      parsed
        .map((item) => normalizeItem(item))
        .filter((item): item is CustomerCartItem => Boolean(item));
    const items = value.length > 0 ? value : emptyCartItems;

    cartCache.set(tableId, { raw, value: items });
    return items;
  } catch {
    cartCache.set(tableId, { raw, value: emptyCartItems });
    return emptyCartItems;
  }
}

export function subscribeToCart(tableId: string, callback: () => void) {
  return subscribeToStorageKey(
    cartChangeEvent,
    getCartKey(tableId),
    tableId,
    callback
  );
}

export function subscribeToOrder(tableId: string, callback: () => void) {
  return subscribeToStorageKey(
    orderChangeEvent,
    getOrderKey(tableId),
    tableId,
    callback
  );
}

export function setCartItems(tableId: string, items: CustomerCartItem[]) {
  if (!canUseStorage()) {
    return;
  }

  const value =
    items
      .map((item) => normalizeItem(item))
      .filter((item): item is CustomerCartItem => Boolean(item));
  const nextItems = value.length > 0 ? value : emptyCartItems;
  const raw = JSON.stringify(nextItems);

  localStorage.setItem(getCartKey(tableId), raw);
  cartCache.set(tableId, { raw, value: nextItems });
  dispatchCartChange(tableId);
}

export function clearCart(tableId: string) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(getCartKey(tableId));
  cartCache.set(tableId, { raw: null, value: emptyCartItems });
  dispatchCartChange(tableId);
}

export function addCartItem(tableId: string, food: CustomerCartFood) {
  const items = getCartItems(tableId);
  const currentItem = items.find((item) => item.id === food.id);
  const nextItems = currentItem
    ? items.map((item) =>
        item.id === food.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    : [...items, { ...food, note: "", quantity: 1 }];

  setCartItems(tableId, nextItems);
  return nextItems;
}

export function getTotalQuantity(items: CustomerCartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotals(items: CustomerCartItem[]) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const adminFee = items.length > 0 ? 2000 : 0;
  const tax = items.length > 0 ? Math.round(subtotal * 0.1) : 0;

  return {
    adminFee,
    subtotal,
    tax,
    total: subtotal + adminFee + tax,
  };
}

export function formatPrice(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function saveOrder(order: CustomerOrder) {
  if (!canUseStorage()) {
    return;
  }

  const raw = JSON.stringify(order);

  localStorage.setItem(getOrderKey(order.tableId), raw);
  orderCache.set(order.tableId, { raw, value: order });
  dispatchOrderChange(order.tableId);
}

export function getLatestOrder(tableId: string): CustomerOrder | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = localStorage.getItem(getOrderKey(tableId));
  const cached = orderCache.get(tableId);

  if (cached?.raw === raw) {
    return cached.value;
  }

  if (!raw) {
    orderCache.set(tableId, { raw, value: null });
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    const value = parsed && typeof parsed === "object" ? parsed : null;

    orderCache.set(tableId, { raw, value });
    return value;
  } catch {
    orderCache.set(tableId, { raw, value: null });
    return null;
  }
}

export function createOrderSnapshot(
  tableId: string,
  tableNumber: string,
  paymentMethod: PaymentMethod
) {
  const items = getCartItems(tableId);

  if (!items.length) {
    return null;
  }

  const totals = getCartTotals(items);
  const createdAt = new Date();
  const expiryAt = new Date(createdAt.getTime() + 15 * 60 * 1000);
  const order: CustomerOrder = {
    ...totals,
    createdAt: createdAt.toISOString(),
    expiryAt: expiryAt.toISOString(),
    id: `PY${Math.floor(100000 + Math.random() * 900000)}`,
    items,
    paymentMethod,
    status: "waiting_payment",
    tableId,
    tableNumber,
  };

  saveOrder(order);
  return order;
}

export function markOrderPaid(tableId: string) {
  const order = getLatestOrder(tableId);

  if (!order) {
    return null;
  }

  const paidOrder: CustomerOrder = {
    ...order,
    paidAt: new Date().toISOString(),
    status: "paid",
  };

  saveOrder(paidOrder);
  clearCart(tableId);
  return paidOrder;
}
