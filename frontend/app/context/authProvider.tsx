"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { GetUser } from "@/lib/auth";
import { User } from "@/types/user";

type Props = {
  children: React.ReactNode;
};

type contextType = {
  user: User | undefined;
  loading: boolean;
  // setUser: React.Dispatch<React.SetStateAction<User | undefined>>
};

const authContext = createContext<contextType | undefined>(undefined);
const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const loginStatus = localStorage.getItem("LoginStatus");
      if (!loginStatus) {
        setLoading(false);
        return;
      }

      try {
        const user = await GetUser();
        setUser(user);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <authContext.Provider value={{ user, loading}}>{children}</authContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(authContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
