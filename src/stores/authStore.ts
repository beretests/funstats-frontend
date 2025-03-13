import { create } from "zustand";
import { supabase } from "../services/supabase";
import { useEffect } from "react";
import { createJSONStorage, persist } from "zustand/middleware";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { User } from "@supabase/supabase-js";
import { useLocation } from "react-router-dom";
// import { useAlertStore } from "./alertStore";

type AuthState = {
  session: any | null;
  user: any | null;
  username: string | null;
  isAuthenticated: boolean;
  setUser: (user: any | null) => void;
  updateUser: (partialUser: Partial<User>) => void;
  setUsername: (username: string | null) => void;
  setSession: (session: any | null) => void;
  removeSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      username: null,
      isAuthenticated: false,
      setSession: (session: any | null) =>
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session,
          username: session.user.user_metadata.username,
        }),
      setUser: (user: any | null) => set({ user }),
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user
            ? { ...state.user.user_metadata, ...partialUser }
            : null,
        })),
      setUsername: (username: any | null) => set({ username }),

      removeSession: () =>
        set({
          user: null,
          session: null,
          username: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);

export const AuthSubscriber = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, setSession, removeSession } = useAuthStore();
  // const showAlert = useAlertStore((state) => state.showAlert);

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      // console.log(`Supabase Auth Event: ${event}`, session);

      switch (event) {
        case "INITIAL_SESSION":
        case "SIGNED_IN":
          // console.log(`Supabase Auth Event: ${event}`, session);
          if (session) {
            setSession(session);
            // Redirect only if not already on a protected route
            // navigate("/profile", { replace: true });
            // showAlert("success", "You are logged in!");
            if (location.pathname === "/" || location.pathname === "/login") {
              navigate("/profile", { replace: true });
            }
          }
          break;

        case "SIGNED_OUT":
          // console.log(`Supabase Auth Event: ${event}`, session);
          removeSession();
          navigate("/login", { replace: true });
          break;

        case "TOKEN_REFRESHED":
          if (session) {
            setSession(session);
          }
          break;

        case "USER_UPDATED":
          if (session) {
            setSession(session);
          }
          break;

        case "PASSWORD_RECOVERY":
          // Handle password recovery logic here if needed
          navigate("/reset-password", { replace: true });
          break;

        default:
          console.warn(`Unhandled auth event type: ${event}`);
      }

      // // Set up API authorization header dynamically
      // if (session) {
      //   api.interceptors.request.use(
      //     async (config) => {
      //       const token = session.access_token;
      //       config.headers.Authorization = `Bearer ${token}`;
      //       return config;
      //     },
      //     (error) => Promise.reject(error)
      //   );
      // }
    };

    // Subscribe to Supabase auth state changes
    // const { data } = supabase.auth.onAuthStateChange(handleAuthChange);
    supabase.auth.onAuthStateChange(handleAuthChange);
    // console.log("Supabase on auth change:", data);
    // return () => {
    //   // Unsubscribe on cleanup
    //   data.subscription.unsubscribe();
    // };
  }, []);

  return null;
};
