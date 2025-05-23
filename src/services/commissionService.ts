
import { Commission, CommissionGroup } from "@/types";
import { generateId } from "@/utils/dataUtils";

export default class CommissionService {
  private commissions: Commission[];

  constructor(commissions: Commission[]) {
    this.commissions = commissions;
  }

  addCommission(commission: Omit<Commission, "id">) {
    const newCommission: Commission = {
      ...commission,
      id: generateId(),
    };

    this.commissions.push(newCommission);
    return newCommission;
  }

  updateCommissionPaymentStatus(id: string, isPaid: boolean, paymentDate: Date | null) {
    const index = this.commissions.findIndex(comm => comm.id === id);
    if (index === -1) return false;

    this.commissions[index].isPaid = isPaid;
    this.commissions[index].paymentDate = paymentDate;
    return true;
  }

  // Method to get the next payment date (10th of next month)
  getNextPaymentDate(): Date {
    const today = new Date();
    // If today is after the 10th, payment is on the 10th of next month
    // If today is before or on the 10th, payment is on the 10th of current month
    let paymentDate = new Date(today.getFullYear(), today.getMonth() + (today.getDate() > 10 ? 1 : 0), 10);
    return paymentDate;
  }

  // Method to calculate commission based on the new fixed rules
  calculateCommission(saleValue: number, memberLine: number, uplineGrade: string | null = null): {
    memberCommission: number;
    uplineCommission: number;
  } {
    // Fixed 3% commission for all members
    const memberCommission = saleValue * 0.03;
    
    let uplineCommission = 0;
    
    // If the sale is from a line 2 member and there's an upline with Gold+ grade
    if (memberLine === 2 && uplineGrade) {
      if (uplineGrade === "gold") {
        uplineCommission = saleValue * 0.005; // 0.5% for Gold
      } else if (["platinum", "diamond"].includes(uplineGrade)) {
        uplineCommission = saleValue * 0.01; // 1% for Platinum or Diamond
      }
    }
    
    return { memberCommission, uplineCommission };
  }

  // Method to get forecast of pending commissions for any period
  getCommissionsForecast(startDate?: Date, endDate?: Date): {
    nextPaymentDate: Date;
    totalPendingAmount: number;
    pendingBatches: number;
    membersWithPending: number;
  } {
    // If no dates provided, use next payment date as reference
    let referenceDate: Date;
    if (!startDate && !endDate) {
      referenceDate = this.getNextPaymentDate();
      
      // Filter commissions that would be included in next payment
      const pendingCommissions = this.commissions.filter(commission => {
        if (commission.isPaid) return false;
        
        const commissionDate = new Date(commission.saleDate);
        const commissionMonth = commissionDate.getMonth();
        const commissionYear = commissionDate.getFullYear();
        
        const referenceMonth = referenceDate.getMonth();
        const referenceYear = referenceDate.getFullYear();
        
        // Include commission if it's from reference month or earlier
        return (commissionYear < referenceYear) || 
               (commissionYear === referenceYear && commissionMonth <= referenceMonth);
      });
      
      // Calculate metrics
      const totalPendingAmount = pendingCommissions.reduce(
        (sum, commission) => sum + commission.commissionValue, 0
      );
      
      // Count unique members with pending commissions
      const uniqueMemberIds = new Set(pendingCommissions.map(comm => comm.memberId));
      const membersWithPending = uniqueMemberIds.size;
      
      // Count unique batches (member + month combinations)
      const uniqueBatches = new Set(
        pendingCommissions.map(comm => {
          const date = new Date(comm.saleDate);
          return `${comm.memberId}-${date.getFullYear()}-${date.getMonth()}`;
        })
      );
      const pendingBatches = uniqueBatches.size;
      
      return {
        nextPaymentDate: referenceDate,
        totalPendingAmount,
        pendingBatches,
        membersWithPending
      };
    } else {
      // Filter by date range if provided
      const start = startDate || new Date(0); // Default to epoch start if not provided
      const end = endDate || new Date();      // Default to today if not provided
      
      // Use the end date as the reference date for display
      referenceDate = end;
      
      // Filter commissions within the date range
      const periodCommissions = this.commissions.filter(commission => {
        if (commission.isPaid) return false;
        
        const commissionDate = new Date(commission.saleDate);
        return commissionDate >= start && commissionDate <= end;
      });
      
      // Calculate metrics
      const totalPendingAmount = periodCommissions.reduce(
        (sum, commission) => sum + commission.commissionValue, 0
      );
      
      // Count unique members with pending commissions
      const uniqueMemberIds = new Set(periodCommissions.map(comm => comm.memberId));
      const membersWithPending = uniqueMemberIds.size;
      
      // Count unique batches (member + month combinations)
      const uniqueBatches = new Set(
        periodCommissions.map(comm => {
          const date = new Date(comm.saleDate);
          return `${comm.memberId}-${date.getFullYear()}-${date.getMonth()}`;
        })
      );
      const pendingBatches = uniqueBatches.size;
      
      return {
        nextPaymentDate: referenceDate,
        totalPendingAmount,
        pendingBatches,
        membersWithPending
      };
    }
  }

  // Método para marcar todas as comissões de um membro em um período específico como pagas
  updateMemberMonthlyCommissions(memberId: string, month: number, year: number, isPaid: boolean) {
    let updated = false;

    this.commissions.forEach((commission, index) => {
      const commissionDate = new Date(commission.saleDate);
      if (
        commission.memberId === memberId && 
        commissionDate.getMonth() + 1 === month && 
        commissionDate.getFullYear() === year
      ) {
        this.commissions[index].isPaid = isPaid;
        this.commissions[index].paymentDate = isPaid ? new Date() : null;
        updated = true;
      }
    });

    return updated;
  }
}
