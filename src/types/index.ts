
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface BinData {
  id: string;
  name: string;
  location: string;
  fillPercentage: number;
  lastUpdated: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
