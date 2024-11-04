// import axiosInstance from 'axiosInstance';
import axiosInstance from '@/lib/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  email: string;
  username: string;
  userType: string;
  created: Date;
  updatedAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface ForgotPasswordDto {
  email: string;
  frontendBaseUri: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// export enum ReportReason {
//   COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
//   INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
//   SPAM = 'SPAM',
//   INCORRECT_INFORMATION = 'INCORRECT_INFORMATION',
//   OTHER = 'OTHER'
// }

// export interface CreateReportDto {
//   reason: ReportReason;
//   description?: string;
// }

// Set JWT token for all future requests
export const setAuthToken = (token: string) => {
  if (token) {
    // Compress or truncate token if needed
    const processedToken = `Bearer ${token}`;
    if (processedToken.length > 8000) {
      console.warn('Token size exceeds recommended limit');
      return false;
    }
    axiosInstance.defaults.headers.common['Authorization'] = processedToken;
    localStorage.setItem('token', token);
    return true;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    return true;
  }
};

// Initialize token from localStorage
export const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>(`${API_URL}/login`, credentials);
    const { token, user } = response.data;
    
    const tokenSet = setAuthToken(token);
    if (!tokenSet) {
      throw new Error('Token size too large');
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData: RegisterDto): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Failed to register');
  }
};

export const logout = () => {
  setAuthToken('');
};

export const verifyToken = async (): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.get<User>(`${API_URL}/verify`);
    return response.data;
  } catch (error) {
    localStorage.removeItem('token'); // Clear invalid token
    throw error;
  }
};

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw new Error(`Failed to fetch user with id ${id}`);
  }
};

export const verifyEmail = async (verificationData: VerifyEmailDto): Promise<void> => {
  try {
    await axiosInstance.post(`${API_URL}/verify-email`, verificationData);
  } catch (error) {
    console.error('Email verification error:', error);
    throw new Error('Failed to verify email');
  }
};

export const requestPasswordReset = async (data: ForgotPasswordDto): Promise<void> => {
  try {
    await axiosInstance.post(`${API_URL}/forgot-password`, data);
  } catch (error) {
    console.error('Password reset request error:', error);
    throw new Error('Failed to request password reset');
  }
};

export const resetPassword = async (data: ResetPasswordDto): Promise<void> => {
  try {
    await axiosInstance.post(`${API_URL}/reset-password`, data);
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error('Failed to reset password');
  }
};

// export const reportSong = async (songId: string, reportData: CreateReportDto): Promise<void> => {
//   try {
//     await axiosInstance.post(`${API_URL}/songs/${songId}/report`, reportData);
//   } catch (error: any) {
//     console.error('Error reporting song:', error);
//     if (error.response?.status === 400 && error.response?.data?.msg === 'You have already reported this song') {
//       throw new Error('You have already reported this song');
//     }
//     throw new Error('Failed to report song');
//   }
// };
