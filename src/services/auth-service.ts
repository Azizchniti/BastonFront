import { User } from '@/types';
import axios from 'axios';

//const API_URL = 'http://localhost:5000/api/auth';
const API_URL = 'https://pfp-backend-0670.onrender.com/api/auth';

export const signUp = async (
  email: string,
  password: string,
  role: string,
  firstName: string,
  lastName: string,
  upline_id?: string
) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      email,
      password,
      role,
      firstName,
      lastName,
       upline_id,
    });
    
    return response.data.user;
  } catch (error) {
    console.error('Signup error:', error);
    console.log("Error response data:", error.response?.data);
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    const { token, user } = response.data;

    console.log("token is:", token);
    console.log("user is:", user);

    return { token, user };
  } catch (error) {
    console.error('Sign in error:', error);
    return null;
  }
};




export async function getCurrentUser(token?: string): Promise<User | null> {
  const finalToken = token || localStorage.getItem("token");
  console.log("Using token in getCurrentUser:", finalToken);

  if (!finalToken) return null;

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${finalToken}`,
      },
    });

    console.log("Get current user response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Get current user error:", error?.response?.data || error.message);
    return null;
  }
}
;




export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`);
    localStorage.removeItem('access_token');
    console.log("User logged out.");
  } catch (error) {
    console.error('Logout error:', error);
  }
};

