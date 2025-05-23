import axios from 'axios';
import { Member } from '../types/member.types'; // Assuming this defines your Member interface
import { Squad } from '@/types';

// Backend API base URL (adjust if needed)
const API_URL = 'https://pfp-backend-0670.onrender.com/api/members';

export const MemberService = {
  // ✅ Get all members (basic info)
  async getAllMembers(): Promise<Member[]> {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  },

  // ✅ Get single member by ID (detailed view)
  async getMemberById(id: string): Promise<Member> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // ✅ Update member by ID
  async updateMember(id: string, updatedData: Partial<Omit<Member, 'id'>>): Promise<Member> {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  },

  // ✅ Delete member by ID
  async deleteMember(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
  // ✅ Get the squad (upline + 12 downlines) for a member
  async getMemberSquad(id: string): Promise<Member[]> {
    const response = await axios.get(`${API_URL}/${id}/squad`);
    return response.data;
  },

  // ✅ Get squad metrics (aggregate data about the member's squad)
  async getSquadMetrics(id: string): Promise<Squad> {
    const response = await axios.get(`${API_URL}/${id}/squad-metrics`);
    return response.data;
  },

  // ✅ Get top members (e.g. top by sales or commissions)
  async getTopMembers(): Promise<Member[]> {
    const response = await axios.get(`${API_URL}/top`);
    return response.data;
  },

};
