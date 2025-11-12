import { User } from "@/types/user.types";
import axios from "axios";

//const API_URL = "http://localhost:5000/api/users";
const API_URL = 'http://91.99.48.218:5000/api/users';

export const UserService = {
  async getAllUsers(token: string): Promise<User[]> {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getUserById(id: string, token: string): Promise<User> {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

async updateUser(id: string, updatedData: Partial<User>, token: string): Promise<User> {
  const response = await axios.put(`${API_URL}/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // ✅ Return the user object directly
  return response.data;
}
,

  async deleteUser(id: string, token: string): Promise<{ message: string }> {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
    async getUserTasks(id: string, token: string) {
    const response = await axios.get(`${API_URL}/${id}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // this will be an array of tasks
  },
// src/services/user.service.ts (add)
async getUsersByDepartment(deptId: string, token: string) {
  const response = await axios.get(`${API_URL}/department/${deptId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
},

};
