
import React from "react";
import { Commission } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Receipt, WalletCards } from "lucide-react";
import { formatCurrency } from "@/utils/dataUtils";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

interface CommissionTableProps {
  commissions: Commission[];
  showActions?: boolean;
}

const CommissionTable: React.FC<CommissionTableProps> = ({ 
  commissions,
  showActions = false
}) => {
  const { updateCommissionPaymentStatus } = useData();
  
  const handleMarkAsPaid = (commission: Commission) => {
    updateCommissionPaymentStatus(commission.id, true, new Date());
    toast.success(`Comissão de ${commission.memberName} marcada como paga!`);
  };

  const handleMarkAsUnpaid = (commission: Commission) => {
    updateCommissionPaymentStatus(commission.id, false, null);
    toast.success(`Status de pagamento da comissão de ${commission.memberName} atualizado!`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  if (commissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <WalletCards className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Nenhuma comissão encontrada</h3>
        <p className="text-muted-foreground">Não existem comissões com os critérios selecionados.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membro</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Data da Venda</TableHead>
            <TableHead>Valor da Venda</TableHead>
            <TableHead>Comissão (%)</TableHead>
            <TableHead>Valor da Comissão</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions.map((commission) => (
            <TableRow key={commission.id}>
              <TableCell className="font-medium">{commission.memberName}</TableCell>
              <TableCell>{commission.leadName}</TableCell>
              <TableCell>{formatDate(commission.saleDate)}</TableCell>
              <TableCell>{formatCurrency(commission.saleValue)}</TableCell>
              <TableCell>{commission.commissionPercentage}%</TableCell>
              <TableCell className="font-medium">{formatCurrency(commission.commissionValue)}</TableCell>
              <TableCell>
                {commission.isPaid ? (
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Paga
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    <AlertCircle className="mr-1 h-3 w-3" /> Pendente
                  </Badge>
                )}
              </TableCell>
              {showActions && (
                <TableCell>
                  {commission.isPaid ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMarkAsUnpaid(commission)}
                    >
                      Marcar como não paga
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleMarkAsPaid(commission)}
                    >
                      Marcar como paga
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommissionTable;
