// src/services/commission.service.ts

import axios from "axios";
import { Commission } from "@/types";

const API_URL = "https://pfp-backend-0670.onrender.com/api/commissions"; // Adjust if needed
let commissions: Commission[] = [];

export const CommissionService = {
  async getAll(): Promise<Commission[]> {
    const res = await axios.get(API_URL);
    return res.data;
  },

  async getById(id: string): Promise<Commission> {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  async create(data: Partial<Commission>): Promise<Commission> {
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  async update(id: string, data: Partial<Commission>): Promise<Commission> {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
   updateCommissionPaymentStatus: (id: string, is_paid: boolean, payment_date: Date | null): boolean => {
    const index = commissions.findIndex(c => c.id === id);
    if (index !== -1) {
      commissions[index] = { ...commissions[index], is_paid, payment_date };
      return true;
    }
    return false;
  },

  updateMemberMonthlyCommissions: (memberId: string, month: number, year: number, isPaid: boolean): boolean => {
    let updated = false;
    commissions = commissions.map(c => {
      if (
        c.member_id === memberId &&
        new Date(c.sale_date).getMonth() + 1 === month &&
        new Date(c.sale_date).getFullYear() === year
      ) {
        updated = true;
        return { ...c, isPaid };
      }
      return c;
    });
    return updated;
  },

  calculateCommission: (saleValue: number, memberLine: number, uplineGrade?: string | null) => {
    const baseRate = 0.1;
    const uplineRate = uplineGrade === "A" ? 0.05 : 0.03;
    return {
      memberCommission: saleValue * baseRate,
      uplineCommission: saleValue * uplineRate,
    };
  },

  getNextPaymentDate: (): Date => {
    const today = new Date();
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  },

  getCommissionsForecast: (startDate?: Date, endDate?: Date) => {
    const filtered = commissions.filter(c => {
      const date = new Date(c.sale_date);
      if (startDate && date < startDate) return false;
      if (endDate && date > endDate) return false;
      return !c.is_paid;
    });

    return {
      nextPaymentDate: CommissionService.getNextPaymentDate(),
      totalPendingAmount: filtered.reduce((sum, c) => sum + c.commission_value, 0),
      //pendingBatches: new Set(filtered.map(c => c.batchId)).size,
      membersWithPending: new Set(filtered.map(c => c.member_id)).size,
    };
  },
};
