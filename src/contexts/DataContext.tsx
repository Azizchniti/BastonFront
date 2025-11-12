import React, { createContext, useContext } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";


// Combined context type definition (no commissions)
type DataContextType = {
  members: User[];
  
  updateMember: (id: string, data: Partial<User>) => void;
  deleteMember: (id: string) => void;
 
  
 
  deleteLead: (id: string) => void;
  closeLead: (id: string, sale_value: number) => void;
  findMemberPath: (memberId: string) => User[];

};

// Create the React context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create the provider that wraps Member and Lead providers
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (

   
   
    <DataContextBridge>
      {children}
    </DataContextBridge>

  );
};

// Helper to consume MemberContext


// Combines both contexts into one
const DataContextBridge = ({ children }: { children: React.ReactNode }) => {

 

  // Combined context value
  const dataContextValue: DataContextType = {
    deleteLead: function (id: string): void {
      throw new Error("Function not implemented.");
    },
    closeLead: function (id: string, sale_value: number): void {
      throw new Error("Function not implemented.");
    },
    members: [],
    updateMember: function (id: string, data: Partial<User>): void {
      throw new Error("Function not implemented.");
    },
    deleteMember: function (id: string): void {
      throw new Error("Function not implemented.");
    },
    findMemberPath: function (memberId: string): User[] {
      throw new Error("Function not implemented.");
    }
  };

  return (
    <DataContext.Provider value={dataContextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Export the hook
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData deve ser usado dentro de um DataProvider");
  }
  return context;
};
