"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  condominiumId: string | null;
  residentId: string | null;
  name: string | null;
  role: string | null;
  login: (token: string, condominiumId: string, residentId: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [condominiumId, setCondominiumId] = useState<string | null>(null);
  const [residentId, setResidentId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

    useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedCondoId = localStorage.getItem("condominiumId");
    const storedResidentId = localStorage.getItem("residentId");
    const storedName = localStorage.getItem("residentName");
    
    if (storedToken && storedCondoId && storedResidentId) {
      setToken(storedToken);
      setCondominiumId(storedCondoId);
      setResidentId(storedResidentId);
      setName(storedName);
      
      try {
        const decoded: any = jwtDecode(storedToken);
        const userRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        setRole(userRole || 'Resident');
      } catch (e) {
        setRole(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (jwtToken: string, condoId: string, resId: string, resName: string) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("condominiumId", condoId);
    localStorage.setItem("residentId", resId);
    localStorage.setItem("residentName", resName);
    setToken(jwtToken);
    setCondominiumId(condoId);
    setResidentId(resId);
    setName(resName);
    
    try {
      const decoded: any = jwtDecode(jwtToken);
      const userRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      setRole(userRole || 'Resident');
    } catch (e) {
      setRole(null);
    }
    
    router.push("/topics");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("condominiumId");
    localStorage.removeItem("residentId");
    localStorage.removeItem("residentName");
    setToken(null);
    setCondominiumId(null);
    setResidentId(null);
    setName(null);
    setRole(null);
    router.push("/setup");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        condominiumId,
        residentId,
        name,
        role,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
