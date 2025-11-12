import { User } from "@/types/user.types";
import axios from "axios";

//const API_URL = import.meta.env.VITE_API_URL + "/auth";
 // from .env, e.g., 'http://localhost:5000/api/auth'
//const API_URL = 'http://localhost:5000/api/auth';
//const API_URL = 'http://91.99.48.218:5000/api/auth';
const API_URL = 'https://baston.agenciafocomkt.com.br/api/auth';



// ✅ Register a new user (admin creates users)
// ✅ Register a new user (admin creates users)
export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: "user" | "admin",
  department: string,
  cpf: string,
  token: string // 👈 include token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      { firstName, lastName, email, password, role, department, cpf },
      { headers: { Authorization: `Bearer ${token}` } } // 👈 add token here
    );

    return response.data.user;
  } catch (error: any) {
    console.error("Signup error:", error);
    throw new Error(error?.response?.data?.message || "Erro ao registrar usuário.");
  }
};



// ✅ Login existing user
export const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, user } = response.data;

    // Save token and user locally
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return { token, user };
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw new Error(error?.response?.data?.message || "Erro ao fazer login.");
  }
};

// ✅ Get current user from token
export async function getCurrentUser(token?: string): Promise<User | null> {
  const finalToken = token || localStorage.getItem("token");
  if (!finalToken) return null;

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${finalToken}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Get current user error:", error?.response?.data || error.message);
    return null;
  }
}

// ✅ Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ✅ Request password reset (simplified)
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/change-password`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao solicitar redefinição de senha.");
  }
};
