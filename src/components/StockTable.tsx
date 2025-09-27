import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { Package2, AlertTriangle, CheckCircle } from "lucide-react";

interface StockTableProps {
  products: Product[];
  onReserveStock: (productId: string, quantity: number) => void;
}

export function StockTable({ products, onReserveStock }: StockTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockStatus = (product: Product) => {
    const availablePercentage = (product.availableQuantity / product.stockQuantity) * 100;

    if (availablePercentage === 0) {
      return { variant: 'destructive' as const, label: 'Esgotado', icon: AlertTriangle };
    } else if (availablePercentage < 20) {
      return { variant: 'warning' as const, label: 'Baixo Estoque', icon: AlertTriangle };
    } else {
      return { variant: 'success' as const, label: 'Disponível', icon: CheckCircle };
    }
  };

  return (
    <Card className="bg-gradient-card shadow-md-primary border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5 text-primary" />
          Controle de Estoque
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Reservado</TableHead>
              <TableHead>Disponível</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const status = getStockStatus(product);
              const StatusIcon = status.icon;

              return (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{product.stockQuantity}</span>
                      <span className="text-muted-foreground">unidades</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-warning">{product.reservedQuantity}</span>
                      <span className="text-muted-foreground">reservadas</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{product.availableQuantity}</span>
                      <span className="text-muted-foreground">disponíveis</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={product.availableQuantity === 0}
                      onClick={() => onReserveStock(product.id, 1)}
                    >
                      Reservar Estoque
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
