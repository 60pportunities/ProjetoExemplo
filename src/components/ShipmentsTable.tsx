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
import { StatusBadge } from "@/components/StatusBadge";
import { Order, Shipment } from "@/types";
import { Truck, ExternalLink, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShipmentsTableProps {
  shipments: Shipment[];
  orders: Order[];
}

export function ShipmentsTable({ shipments, orders }: ShipmentsTableProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getOrderInfo = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const handleCopyTracking = (trackingCode: string) => {
    navigator.clipboard.writeText(trackingCode);
    toast({
      title: "Código Copiado",
      description: `Código de rastreio ${trackingCode} copiado para a área de transferência`,
    });
  };

  const handleTrackShipment = (trackingCode: string) => {
    toast({
      title: "Rastreamento",
      description: `Abrindo rastreamento para ${trackingCode}`,
    });
  };

  return (
    <Card className="bg-gradient-card shadow-md-primary border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Remessas e Rastreamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Remessa</TableHead>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Transportadora</TableHead>
              <TableHead>Código de Rastreio</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Previsão de Entrega</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => {
              const orderInfo = getOrderInfo(shipment.orderId);

              return (
                <TableRow key={shipment.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">#{shipment.id}</TableCell>
                  <TableCell className="font-mono text-sm">#{shipment.orderId}</TableCell>
                  <TableCell>
                    {orderInfo && (
                      <div>
                        <div className="font-medium">{orderInfo.customerName}</div>
                        <div className="text-sm text-muted-foreground">{orderInfo.customerEmail}</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{shipment.carrier}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {shipment.trackingCode}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyTracking(shipment.trackingCode)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={shipment.status} type="shipment" />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {shipment.estimatedDelivery
                      ? formatDate(shipment.estimatedDelivery)
                      : 'Não informada'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackShipment(shipment.trackingCode)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Rastrear
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {shipments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma remessa encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
