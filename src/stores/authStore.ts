import { create } from "zustand";
import { supabase } from "../services/supabase";
import { useEffect } from "react";
import { createJSONStorage, persist } from "zustand/middleware";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
// import { useLocation } from "react-router-dom";

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
      setSession: (session: any | null) => {
        set({
          session,
          user: session?.user || null,
          isAuthenticated: !!session,
          username: session.user.user_metadata.username,
        });
      },
      setUser: (user: any | null) => set({ user }),
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user
            ? { ...state.user.user_metadata, ...partialUser }
            : null,
        })),
      setUsername: (username: any | null) => set({ username }),

      removeSession: () => {
        set({
          user: null,
          session: null,
          username: null,
          isAuthenticated: false,
        });
        // localStorage.removeItem("auth-storage");
        // useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // skipHydration: true,
    }
  )
);

export const AuthSubscriber = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const { setSession, removeSession } = useAuthStore();
  // const newSession = session;

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      switch (event) {
        case "INITIAL_SESSION":
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          if (session) {
            // Check if the session is expired
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if (session.expires_at && session.expires_at <= currentTime) {
              console.warn("Session expired. Removing stored session.");
              removeSession();
            } else {
              setSession(session);
            }
          }
          break;

        case "SIGNED_OUT":
          removeSession();
          break;

        case "PASSWORD_RECOVERY":
          navigate("/reset-password", { replace: true });
          break;

        default:
          if (!session) {
            removeSession();
          }
          console.warn(`Unhandled auth event type: ${event}`);
      }
    };

    supabase.auth.onAuthStateChange(handleAuthChange);
  }, []);

  return null;
};
