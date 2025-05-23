
import React, { createContext, useContext, useState } from "react";
import { Commission, MonthlyCommission } from "@/types";
import { toast } from "sonner";
import { MOCK_COMMISSIONS } from "@/data/mockData";
import CommissionService from "@/services/commissionService";

// Commission context type definition
type CommissionContextType = {
  commissions: Commission[];
  getMemberCommissions: (memberId: string) => Commission[];
  getMemberMonthlyCommissions: (memberId: string) => MonthlyCommission[];
  updateCommissionPaymentStatus: (id: string, isPaid: boolean, paymentDate: Date | null) => boolean;
  updateMemberMonthlyCommissions: (memberId: string, month: number, year: number, isPaid: boolean) => boolean;
  getNextPaymentDate: () => Date;
  calculateCommission: (saleValue: number, memberLine: number, uplineGrade?: string | null) => {
    memberCommission: number;
    uplineCommission: number;
  };
  getCommissionsForecast: (startDate?: Date, endDate?: Date) => {
    nextPaymentDate: Date;
    totalPendingAmount: number;
    pendingBatches: number;
    membersWithPending: number;
  };
};

const CommissionContext = createContext<CommissionContextType | undefined>(undefined);

export const CommissionProvider: React.FC<{ 
  children: React.ReactNode, 
  memberCommissionService?: any 
}> = ({
  children,
  memberCommissionService = null,
}) => {
  const [commissions, setCommissions] = useState<Commission[]>(MOCK_COMMISSIONS);
  
  // Instantiate the service
  const commissionService = new CommissionService(commissions);

  // Commission management functions
  const getMemberCommissions = (memberId: string) => {
    return commissions.filter(commission => commission.memberId === memberId);
  };

  const getMemberMonthlyCommissions = (memberId: string): MonthlyCommission[] => {
    if (memberCommissionService) {
      return memberCommissionService.getMemberMonthlyCommissions(memberId);
    }
    return [];
  };

  const updateCommissionPaymentStatus = (id: string, isPaid: boolean, paymentDate: Date | null) => {
    if (commissionService.updateCommissionPaymentStatus(id, isPaid, paymentDate)) {
      setCommissions([...commissionService["commissions"]]);
      return true;
    }
    return false;
  };

  const updateMemberMonthlyCommissions = (memberId: string, month: number, year: number, isPaid: boolean) => {
    if (commissionService.updateMemberMonthlyCommissions(memberId, month, year, isPaid)) {
      setCommissions([...commissionService["commissions"]]);
      return true;
    }
    return false;
  };

  // New function to calculate commission based on the new rules
  const calculateCommission = (saleValue: number, memberLine: number, uplineGrade?: string | null) => {
    return commissionService.calculateCommission(saleValue, memberLine, uplineGrade);
  };

  // Forecast functions
  const getNextPaymentDate = () => {
    return commissionService.getNextPaymentDate();
  };

  const getCommissionsForecast = (startDate?: Date, endDate?: Date) => {
    return commissionService.getCommissionsForecast(startDate, endDate);
  };

  return (
    <CommissionContext.Provider
      value={{
        commissions,
        getMemberCommissions,
        getMemberMonthlyCommissions,
        updateCommissionPaymentStatus,
        updateMemberMonthlyCommissions,
        calculateCommission,
        getNextPaymentDate,
        getCommissionsForecast,
      }}
    >
      {children}
    </CommissionContext.Provider>
  );
};

export const useCommissionContext = (): CommissionContextType => {
  const context = useContext(CommissionContext);
  if (!context) {
    throw new Error("useCommissionContext deve ser usado dentro de um CommissionProvider");
  }
  return context;
};
