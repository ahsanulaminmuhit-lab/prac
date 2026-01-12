import { axiosPublic } from "./axios";

export interface AuthResponse {
  status: boolean;
  message: string;
  token?: string;
  data?: {
    _id: string;
    email: string;
    role: string;
    name: string;
    userStatus: string;
    photo?: string;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData extends SignInData {
  name: string;
  role?: string;
}

export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  try {
    const response = await axiosPublic.post(`v1/auth/login`, data);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to sign in");
  }
};

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await axiosPublic.post(`v1/auth/register`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to sign up");
  }
};

export const setAuthToken = (token: string) => {
  if (token) {
    axiosPublic.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axiosPublic.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
