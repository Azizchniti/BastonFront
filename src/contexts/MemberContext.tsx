
import React, { createContext, useContext, useState } from "react";
import { Member } from "@/types";
import { toast } from "sonner";
import { MOCK_MEMBERS } from "@/data/mockData";
import { findMemberPath } from "@/utils/dataUtils";
import { MemberService } from "@/services/members.service";

// Member context type definition
type MemberContextType = {
  members: Member[];
  addMember: (member: Omit<Member, "id" | "createdAt" | "grade" | "totalSales" | "totalContacts" | "totalCommission">) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  getMemberSquad: (memberId: string) => Member[];
  getSquadMetrics: (memberId: string) => import("@/types").Squad;
  getTopMembers: () => Member[];
  findMemberPath: (memberId: string) => Member[];
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  
  // Instantiate the service
  const memberService = MemberService;

  // Member management functions

  const updateMember = (id: string, data: Partial<Member>) => {
    if (memberService.updateMember(id, data)) {
      setMembers([...memberService["members"]]);
    }
  };

  const deleteMember = (id: string) => {
    if (memberService.deleteMember(id)) {
      setMembers([...memberService["members"]]);
    }
  };

  // Squad and metrics functions
  const getMemberSquad = (memberId: string) => {
    return memberService.getMemberSquad(memberId);
  };

  const getSquadMetrics = (memberId: string) => {
    return memberService.getSquadMetrics(memberId);
  };

  const getTopMembers = () => {
    return memberService.getTopMembers();
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        updateMember,
        deleteMember,
        getMemberSquad,
        getSquadMetrics,
        getTopMembers,
        findMemberPath: (memberId: string) => findMemberPath(members, memberId),
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMemberContext = (): MemberContextType => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMemberContext deve ser usado dentro de um MemberProvider");
  }
  return context;
};
