import { Badge } from "@/components/ui/badge";
import { OrderStatus, ShipmentStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus | ShipmentStatus;
  type: 'order' | 'shipment';
}

const getOrderStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'pending_payment':
      return { variant: 'warning' as const, label: 'Aguardando Pagamento' };
    case 'paid':
      return { variant: 'success' as const, label: 'Pago' };
    case 'processing':
      return { variant: 'default' as const, label: 'Processando' };
    case 'shipped':
      return { variant: 'default' as const, label: 'Enviado' };
    case 'delivered':
      return { variant: 'success' as const, label: 'Entregue' };
    case 'cancelled':
      return { variant: 'destructive' as const, label: 'Cancelado' };
    default:
      return { variant: 'default' as const, label: 'Desconhecido' };
  }
};

const getShipmentStatusConfig = (status: ShipmentStatus) => {
  switch (status) {
    case 'awaiting_pickup':
      return { variant: 'warning' as const, label: 'Aguardando Coleta' };
    case 'in_transit':
      return { variant: 'default' as const, label: 'Em Trânsito' };
    case 'delivered':
      return { variant: 'success' as const, label: 'Entregue' };
    case 'returned':
      return { variant: 'destructive' as const, label: 'Devolvido' };
    default:
      return { variant: 'default' as const, label: 'Desconhecido' };
  }
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const config = type === 'order'
    ? getOrderStatusConfig(status as OrderStatus)
    : getShipmentStatusConfig(status as ShipmentStatus);

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
}
