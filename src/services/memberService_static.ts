
import { Member, Squad, MonthlyCommission, Commission } from "@/types";
import { generateId, calculateMemberGrade } from "@/utils/dataUtils";
import { toast } from "sonner";

export default class MemberService {
  private members: Member[];
  private commissions: Commission[];

  constructor(members: Member[], commissions: Commission[]) {
    this.members = members;
    this.commissions = commissions;
  }

  addMember(memberData: Omit<Member, "id" | "createdAt" | "grade" | "totalSales" | "totalContacts" | "totalCommission">) {
    // Verificar se o CPF já está cadastrado
    if (this.members.some(m => m.cpf === memberData.cpf)) {
      toast.error("CPF já cadastrado no sistema");
      return false;
    }

    // Verificar se é um membro de linha 1 (sem upline) e se já atingimos o limite de 12
    if (!memberData.uplineId) {
      const rootMembersCount = this.members.filter(m => m.uplineId === null).length;
      if (rootMembersCount >= 12) {
        toast.error("Limite de 12 membros na Linha 1 já foi atingido");
        return false;
      }
    } else {
      // Verificar se o upline é membro da linha 1 e tem graduação Gold ou superior
      const uplineMember = this.members.find(m => m.id === memberData.uplineId);
      if (!uplineMember) {
        toast.error("Membro upline não encontrado");
        return false;
      }

      // Verificar se o upline é da linha 1 (não tem upline)
      if (uplineMember.uplineId !== null) {
        toast.error("Apenas membros da Linha 1 podem adicionar novos membros");
        return false;
      }

      // Verificar se o upline tem graduação Gold ou superior
      if (!["gold", "platinum", "diamond"].includes(uplineMember.grade)) {
        toast.error("Apenas membros com graduação Gold ou superior podem adicionar novos membros");
        return false;
      }

      // Verificar se o upline já tem 12 membros diretos
      const directDownlineCount = this.members.filter(m => m.uplineId === uplineMember.id).length;
      if (directDownlineCount >= 12) {
        toast.error(`O membro ${uplineMember.name} já atingiu o limite de 12 membros em sua linha`);
        return false;
      }
    }

    const newMember: Member = {
      ...memberData,
      id: generateId(),
      grade: "start",
      totalSales: 0,
      totalContacts: 0,
      totalCommission: 0,
      createdAt: new Date(),
    };

    this.members.push(newMember);
    toast.success("Membro adicionado com sucesso");
    return true;
  }

  updateMember(id: string, data: Partial<Member>) {
    // Verificar se o CPF está sendo alterado e se já existe
    if (data.cpf && this.members.some(m => m.cpf === data.cpf && m.id !== id)) {
      toast.error("CPF já cadastrado para outro membro");
      return false;
    }

    const index = this.members.findIndex(member => member.id === id);
    if (index === -1) {
      toast.error("Membro não encontrado");
      return false;
    }

    this.members[index] = { ...this.members[index], ...data };
    toast.success("Membro atualizado com sucesso");
    return true;
  }

  deleteMember(id: string) {
    // Verificar se existem membros que têm este como upline
    const downlineMembers = this.members.filter(m => m.uplineId === id);
    
    // Se existirem, atualizar seu uplineId para o upline do membro sendo excluído
    const memberToDelete = this.members.find(m => m.id === id);
    
    if (downlineMembers.length > 0 && memberToDelete) {
      const newUplineId = memberToDelete.uplineId;
      
      this.members.forEach(member => {
        if (member.uplineId === id) {
          member.uplineId = newUplineId;
        }
      });
    }
    
    // Excluir o membro
    const initialLength = this.members.length;
    this.members = this.members.filter(member => member.id !== id);
    
    if (initialLength !== this.members.length) {
      toast.success("Membro excluído com sucesso");
      return true;
    }
    
    toast.error("Membro não encontrado");
    return false;
  }

  getMemberCommissions(memberId: string) {
    return this.commissions.filter(c => c.memberId === memberId);
  }

  getMemberSquad(memberId: string) {
    // Função recursiva para obter todos os membros downline
    const getAllDownline = (id: string): Member[] => {
      const directDownline = this.members.filter(m => m.uplineId === id);
      
      return directDownline.reduce(
        (acc, member) => [...acc, member, ...getAllDownline(member.id)],
        [] as Member[]
      );
    };
    
    return getAllDownline(memberId);
  }

  getSquadMetrics(memberId: string): Squad {
    const squadMembers = this.getMemberSquad(memberId);
    const memberInfo = this.members.find(m => m.id === memberId);
    
    if (!memberInfo) {
      return {
        memberId,
        memberName: "Desconhecido",
        totalMembers: squadMembers.length,
        totalContacts: squadMembers.reduce((sum, member) => sum + member.totalContacts, 0),
        totalSales: squadMembers.reduce((sum, member) => sum + member.totalSales, 0),
        totalValue: 0,
      };
    }
    
    return {
      memberId,
      memberName: memberInfo.name,
      totalMembers: squadMembers.length,
      totalContacts: squadMembers.reduce((sum, member) => sum + member.totalContacts, 0),
      totalSales: squadMembers.reduce((sum, member) => sum + member.totalSales, 0),
      totalValue: squadMembers.reduce((sum, member) => sum + member.totalCommission, 0),
    };
  }

  getMemberMonthlyCommissions(memberId: string): MonthlyCommission[] {
    const memberCommissions = this.getMemberCommissions(memberId);
    
    // Agrupar por mês/ano
    const monthlyGroups: Record<string, Commission[]> = {};
    
    memberCommissions.forEach(commission => {
      const date = new Date(commission.saleDate);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyGroups[key]) {
        monthlyGroups[key] = [];
      }
      
      monthlyGroups[key].push(commission);
    });
    
    // Converter para o formato de saída
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                         "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    return Object.entries(monthlyGroups).map(([key, commissions]) => {
      const [year, month] = key.split('-').map(Number);
      
      return {
        month: monthNames[month - 1],
        year,
        totalCommission: commissions.reduce((sum, c) => sum + c.commissionValue, 0),
        isPaid: commissions.every(c => c.isPaid),
        details: commissions,
      };
    }).sort((a, b) => {
      // Ordenar por ano e mês (decrescente)
      if (a.year !== b.year) return b.year - a.year;
      return monthNames.indexOf(b.month) - monthNames.indexOf(a.month);
    });
  }

  getTopMembers() {
    return [...this.members]
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);
  }

  incrementMemberContacts(memberId: string) {
    const memberIndex = this.members.findIndex(m => m.id === memberId);
    if (memberIndex >= 0) {
      this.members[memberIndex].totalContacts += 1;
      return true;
    }
    return false;
  }

  updateMemberSalesAndCommission(memberId: string, saleValue: number, commissionValue: number) {
    const memberIndex = this.members.findIndex(m => m.id === memberId);
    if (memberIndex >= 0) {
      const newTotalSales = this.members[memberIndex].totalSales + saleValue;
      this.members[memberIndex].totalSales = newTotalSales;
      this.members[memberIndex].totalCommission += commissionValue;
      // Recalcular grade com base no novo total de vendas
      this.members[memberIndex].grade = calculateMemberGrade(newTotalSales);
      return true;
    }
    return false;
  }

  // Novas funções para verificar se um membro pode adicionar outros membros
  canAddMembers(memberId: string): boolean {
    const member = this.members.find(m => m.id === memberId);
    if (!member) return false;
    
    // Apenas membros da Linha 1 com graduação Gold ou superior podem adicionar membros
    if (member.uplineId === null && ["gold", "platinum", "diamond"].includes(member.grade)) {
      // Verificar se já atingiu o limite de 12 membros na Linha 2
      const directDownlineCount = this.members.filter(m => m.uplineId === memberId).length;
      return directDownlineCount < 12;
    }
    
    return false;
  }

  // Verificar se um membro é de Linha 1
  isLine1Member(memberId: string): boolean {
    const member = this.members.find(m => m.id === memberId);
    return member ? member.uplineId === null : false;
  }

  // Verificar se um membro é de Linha 2
  isLine2Member(memberId: string): boolean {
    const member = this.members.find(m => m.id === memberId);
    if (!member) return false;
    
    if (member.uplineId) {
      const uplineMember = this.members.find(m => m.id === member.uplineId);
      return uplineMember ? uplineMember.uplineId === null : false;
    }
    
    return false;
  }

  // Obter a linha de um membro (1 ou 2)
  getMemberLine(memberId: string): number {
    if (this.isLine1Member(memberId)) return 1;
    if (this.isLine2Member(memberId)) return 2;
    return 0; // Caso não seja identificável ou não exista
  }
}
