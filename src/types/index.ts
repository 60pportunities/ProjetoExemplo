export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ShipmentStatus = 'awaiting_pickup' | 'in_transit' | 'delivered' | 'returned';

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingCode: string;
  carrier: string;
  status: ShipmentStatus;
  shippingAddress: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export interface StockReservation {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  reservedAt: string;
  expiresAt: string;
}
