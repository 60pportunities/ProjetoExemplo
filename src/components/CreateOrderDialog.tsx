import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Order, OrderItem, Product } from "@/types";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onCreateOrder: (order: Order) => void;
}

interface CartItem {
  productId: string;
  quantity: number;
}

export function CreateOrderDialog({ open, onOpenChange, products, onCreateOrder }: CreateOrderDialogProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCartItems([]);
    setSelectedProductId("");
  };

  const addToCart = () => {
    if (!selectedProductId) return;

    const product = products.find(p => p.id === selectedProductId);
    if (!product || product.availableQuantity === 0) {
      toast({
        title: "Produto Indisponível",
        description: "Este produto não possui estoque disponível",
        variant: "destructive"
      });
      return;
    }

    const existingItem = cartItems.find(item => item.productId === selectedProductId);

    if (existingItem) {
      if (existingItem.quantity >= product.availableQuantity) {
        toast({
          title: "Estoque Insuficiente",
          description: `Apenas ${product.availableQuantity} unidades disponíveis`,
          variant: "destructive"
        });
        return;
      }

      setCartItems(prev => prev.map(item =>
        item.productId === selectedProductId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems(prev => [...prev, { productId: selectedProductId, quantity: 1 }]);
    }

    setSelectedProductId("");
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > product.availableQuantity) {
      toast({
        title: "Estoque Insuficiente",
        description: `Apenas ${product.availableQuantity} unidades disponíveis`,
        variant: "destructive"
      });
      return;
    }

    setCartItems(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      toast({
        title: "Dados Incompletos",
        description: "Preencha nome e email do cliente",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Carrinho Vazio",
        description: "Adicione pelo menos um produto ao pedido",
        variant: "destructive"
      });
      return;
    }

    const orderItems: OrderItem[] = cartItems.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        id: `item_${Date.now()}_${item.productId}`,
        productId: item.productId,
        sku: product.sku,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: product.price * item.quantity
      };
    });

    const newOrder: Order = {
      id: `${Date.now()}`,
      customerId: `cust_${Date.now()}`,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      items: orderItems,
      totalAmount: calculateTotal(),
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onCreateOrder(newOrder);
    resetForm();
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Criar Novo Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Dados do Cliente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nome do Cliente</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Products */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Adicionar Produtos</h3>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter(product => product.availableQuantity > 0)
                        .map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.sku}) - {formatCurrency(product.price)} - {product.availableQuantity} disponível
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addToCart} disabled={!selectedProductId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          {cartItems.length > 0 && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg">Itens do Pedido</h3>
                <div className="space-y-3">
                  {cartItems.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.sku} - {formatCurrency(product.price)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <div className="w-20 text-right font-semibold">
                            {formatCurrency(product.price * item.quantity)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-primary">
              Criar Pedido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
