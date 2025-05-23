
import React, { useState } from "react";
import { Commission, CommissionGroup } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Receipt } from "lucide-react";
import { formatCurrency, formatDate, getMonthName } from "@/utils/dataUtils";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

interface CommissionGroupTableProps {
  commissionGroups: CommissionGroup[];
}

const CommissionGroupTable: React.FC<CommissionGroupTableProps> = ({ commissionGroups }) => {
  const { updateMemberMonthlyCommissions } = useData();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const toggleExpand = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  
  const handleMarkAsPaid = (group: CommissionGroup) => {
    if (updateMemberMonthlyCommissions(group.memberId, group.month, group.year, true)) {
      toast.success(`Comissões de ${group.memberName} para ${getMonthName(group.month)}/${group.year} marcadas como pagas!`);
    }
  };

  const handleMarkAsUnpaid = (group: CommissionGroup) => {
    if (updateMemberMonthlyCommissions(group.memberId, group.month, group.year, false)) {
      toast.success(`Status de pagamento das comissões de ${group.memberName} para ${getMonthName(group.month)}/${group.year} atualizado!`);
    }
  };

  if (commissionGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Receipt className="h-12 w-12 text-muted-foreground/50" />
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
            <TableHead className="w-10"></TableHead>
            <TableHead>Membro</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Data de Pagamento</TableHead>
            <TableHead>Total de Vendas</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissionGroups.map((group) => (
            <React.Fragment key={group.id}>
              <TableRow 
                className="cursor-pointer hover:bg-muted" 
                onClick={() => toggleExpand(group.id)}
              >
                <TableCell>
                  {expandedGroups[group.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{group.memberName}</TableCell>
                <TableCell>{getMonthName(group.month)}/{group.year}</TableCell>
                <TableCell>{group.isPaid && group.commissions[0].paymentDate ? formatDate(group.commissions[0].paymentDate) : "-"}</TableCell>
                <TableCell>{group.commissions.length}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(group.totalValue)}</TableCell>
                <TableCell>
                  {group.isPaid ? (
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Paga
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800">
                      <AlertCircle className="mr-1 h-3 w-3" /> Pendente
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {group.isPaid ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsUnpaid(group);
                      }}
                    >
                      Marcar como não paga
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsPaid(group);
                      }}
                    >
                      Marcar como paga
                    </Button>
                  )}
                </TableCell>
              </TableRow>
              
              {expandedGroups[group.id] && group.commissions.map((commission) => (
                <TableRow key={commission.id} className="bg-muted/30">
                  <TableCell></TableCell>
                  <TableCell colSpan={2} className="pl-8">
                    <span className="text-muted-foreground">Lead:</span> {commission.leadName}
                  </TableCell>
                  <TableCell>{formatDate(commission.saleDate)}</TableCell>
                  <TableCell>{formatCurrency(commission.saleValue)}</TableCell>
                  <TableCell>{formatCurrency(commission.commissionValue)}</TableCell>
                  <TableCell>{commission.commissionPercentage}%</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommissionGroupTable;
