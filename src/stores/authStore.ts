import { create } from "zustand";
import { supabase } from "../services/supabase";
import { useEffect } from "react";
import { createJSONStorage, persist } from "zustand/middleware";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
// import { useLocation } from "react-router-dom";
import { useAlertStore } from "./alertStore";

type AuthState = {
  session: any | null;
  user: any | null;
  username: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setUser: (user: any | null) => void;
  updateUser: (partialUser: Partial<User>) => void;
  setUsername: (username: string | null) => void;
  setSession: (session: any | null) => void;
  removeSession: () => void;
  setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      username: null,
      isAuthenticated: false,
      hasHydrated: false,
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

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // Mark hydration as complete
      },
    }
  )
);

export const AuthSubscriber = () => {
  const navigate = useNavigate();
  const { setSession, removeSession } = useAuthStore();
  const { showAlert } = useAlertStore();

  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      switch (event) {
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
          if (session) {
            setSession(session);
          }
          break;

        case "SIGNED_OUT":
          removeSession();
          break;

        case "PASSWORD_RECOVERY":
          navigate("/reset-password", { replace: true });
          break;

        default:
          if (
            !session ||
            (session.expires_at &&
              session.expires_at <= Math.floor(Date.now() / 1000))
          ) {
            removeSession();
          }
          console.warn(`Unhandled auth event type: ${event}`);
      }
    };

    const checkSessionExpiry = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        removeSession();
        navigate("/login");
        showAlert("warning", "Your session expired. Please relogin.");
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);
    checkSessionExpiry();
    return () => subscription.unsubscribe();
  }, []);
  return null;
};
