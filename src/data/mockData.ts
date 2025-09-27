import { Product, Order, Shipment, OrderStatus, ShipmentStatus } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'ABC123',
    name: 'Smartphone Galaxy Pro',
    price: 899.99,
    stockQuantity: 50,
    reservedQuantity: 8,
    availableQuantity: 42
  },
  {
    id: '2',
    sku: 'XYZ999',
    name: 'Laptop UltraBook',
    price: 1299.99,
    stockQuantity: 25,
    reservedQuantity: 3,
    availableQuantity: 22
  },
  {
    id: '3',
    sku: 'DEF456',
    name: 'Headphones Wireless',
    price: 199.99,
    stockQuantity: 100,
    reservedQuantity: 15,
    availableQuantity: 85
  }
];

export const mockOrders: Order[] = [
  {
    id: '12345',
    customerId: 'cust_001',
    customerName: 'João Silva',
    customerEmail: 'joao@email.com',
    items: [
      {
        id: 'item_1',
        productId: '1',
        sku: 'ABC123',
        productName: 'Smartphone Galaxy Pro',
        quantity: 2,
        unitPrice: 899.99,
        totalPrice: 1799.98
      }
    ],
    totalAmount: 1799.98,
    status: 'paid' as OrderStatus,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    paymentMethod: 'credit_card'
  },
  {
    id: '12346',
    customerId: 'cust_002',
    customerName: 'Maria Santos',
    customerEmail: 'maria@email.com',
    items: [
      {
        id: 'item_2',
        productId: '2',
        sku: 'XYZ999',
        productName: 'Laptop UltraBook',
        quantity: 1,
        unitPrice: 1299.99,
        totalPrice: 1299.99
      }
    ],
    totalAmount: 1299.99,
    status: 'pending_payment' as OrderStatus,
    createdAt: '2024-01-15T15:45:00Z',
    updatedAt: '2024-01-15T15:45:00Z'
  },
  {
    id: '12347',
    customerId: 'cust_003',
    customerName: 'Carlos Oliveira',
    customerEmail: 'carlos@email.com',
    items: [
      {
        id: 'item_3',
        productId: '3',
        sku: 'DEF456',
        productName: 'Headphones Wireless',
        quantity: 3,
        unitPrice: 199.99,
        totalPrice: 599.97
      }
    ],
    totalAmount: 599.97,
    status: 'shipped' as OrderStatus,
    createdAt: '2024-01-14T09:20:00Z',
    updatedAt: '2024-01-15T11:10:00Z',
    paymentMethod: 'pix'
  }
];

export const mockShipments: Shipment[] = [
  {
    id: 'ship_001',
    orderId: '12345',
    trackingCode: 'TR123456789BR',
    carrier: 'Transportadora Express',
    status: 'awaiting_pickup' as ShipmentStatus,
    shippingAddress: 'Rua das Flores, 123 - São Paulo, SP',
    createdAt: '2024-01-15T14:30:00Z',
    estimatedDelivery: '2024-01-18T18:00:00Z'
  },
  {
    id: 'ship_002',
    orderId: '12347',
    trackingCode: 'TR987654321BR',
    carrier: 'Logística Rápida',
    status: 'in_transit' as ShipmentStatus,
    shippingAddress: 'Av. Central, 456 - Rio de Janeiro, RJ',
    createdAt: '2024-01-15T11:20:00Z',
    estimatedDelivery: '2024-01-17T16:00:00Z'
  }
];
