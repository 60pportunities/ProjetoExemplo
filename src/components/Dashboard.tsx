import { useState } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { OrdersTable } from "@/components/OrdersTable";
import { StockTable } from "@/components/StockTable";
import { ShipmentsTable } from "@/components/ShipmentsTable";
import { CreateOrderDialog } from "@/components/CreateOrderDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOrders, mockProducts, mockShipments } from "@/data/mockData";
import { Order, Product, Shipment } from "@/types";
import {
  Package,
  ShoppingCart,
  Truck,
  TrendingUp,
  Plus,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  // Dashboard calculations
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending_payment').length;
  const lowStockProducts = products.filter(product => product.availableQuantity < product.stockQuantity * 0.2).length;

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "Visualizar Pedido",
      description: `Abrindo detalhes do pedido #${orderId}`,
    });
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    ));

    toast({
      title: "Status Atualizado",
      description: `Pedido #${orderId} marcado como ${status}`,
    });

    // Auto-generate shipment for paid orders
    if (status === 'paid') {
      generateShipment(orderId);
    }
  };

  const handleReserveStock = (productId: string, quantity: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId ? {
        ...product,
        reservedQuantity: product.reservedQuantity + quantity,
        availableQuantity: product.availableQuantity - quantity
      } : product
    ));

    toast({
      title: "Estoque Reservado",
      description: `${quantity} unidade(s) reservada(s) com sucesso`,
    });
  };

  const generateShipment = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newShipment: Shipment = {
      id: `ship_${Date.now()}`,
      orderId,
      trackingCode: `TR${Date.now()}BR`,
      carrier: 'Transportadora Express',
      status: 'awaiting_pickup',
      shippingAddress: 'Endereço do Cliente',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    setShipments(prev => [...prev, newShipment]);

    toast({
      title: "Remessa Criada",
      description: `Código de rastreio: ${newShipment.trackingCode}`,
    });
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // Reserve stock for order items
    newOrder.items.forEach(item => {
      handleReserveStock(item.productId, item.quantity);
    });

    toast({
      title: "Pedido Criado",
      description: `Pedido #${newOrder.id} criado com sucesso!`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Pedidos</h1>
          <p className="text-muted-foreground">Gerencie pedidos, estoque e remessas</p>
        </div>
        <Button
          onClick={() => setCreateOrderOpen(true)}
          className="bg-gradient-primary hover:opacity-90 shadow-md-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Pedidos"
          value={totalOrders}
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Receita Total"
          value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Pagamentos Pendentes"
          value={pendingOrders}
          icon={AlertCircle}
          description={`${pendingOrders} pedidos aguardando pagamento`}
        />
        <DashboardCard
          title="Produtos com Baixo Estoque"
          value={lowStockProducts}
          icon={Package}
          description={`${lowStockProducts} produtos precisam de reposição`}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="bg-card">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Estoque
          </TabsTrigger>
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Remessas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <OrdersTable
            orders={orders}
            onViewOrder={handleViewOrder}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <StockTable
            products={products}
            onReserveStock={handleReserveStock}
          />
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <ShipmentsTable shipments={shipments} orders={orders} />
        </TabsContent>
      </Tabs>

      <CreateOrderDialog
        open={createOrderOpen}
        onOpenChange={setCreateOrderOpen}
        products={products}
        onCreateOrder={handleCreateOrder}
      />
    </div>
  );
}
