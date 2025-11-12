
export type UserRole = 'admin' | 'member';

export type MemberGrade = 'silver' | 'gold' | 'platinum' | 'diamond';

export type LeadStatus = 'new' | 'contacted' | 'in-progress' | 'negotiating' | 'closed' | 'lost';

export type AnnouncementType = 'news' | 'notice' | 'announcement';


export interface Task {
  [x: string]: any;
  id: string;
  title: string;
  description: string;
  department_id: string;
  status: string;
  created_by: string;
  responsible_user_id?: string;
  deadline?: string;
  created_at?: string;
  updated_at?: string;
  responsible_user?: User;
  support_users?: { user_id: string; users: User }[];
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_type: "user" | "ai" | "team";
  created_at: string;
  sender?: {
    first_name: string;
    last_name: string;
  };
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  cpf?: string;
  department?: string;
  role: "admin" | "user";
}

