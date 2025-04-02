import { create } from "zustand";
import { supabase } from "../services/supabase";
import { useEffect } from "react";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "@supabase/supabase-js";
import dayjs from "dayjs";

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
  updateUserProfile: (profile: {
    username?: string;
    full_name?: any;
    email?: any;
    dateOfBirth?: dayjs.Dayjs;
    date_of_birth?: number;
    favorite_soccer_player?: any;
    position?: any;
  }) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
      },

      updateUserProfile: async (profile) => {
        const { user } = get();
        if (!user) return;

        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }

        return;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const AuthSubscriber = () => {
  const { setSession, removeSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      } else {
        removeSession();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setSession(session);
        } else if (event === "SIGNED_OUT") {
          removeSession();
        }
      } else {
        removeSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, removeSession]);
  return null;
};
