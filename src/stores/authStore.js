import { create } from "zustand";
import { supabase } from "../supabase"; // Assuming supabase is initialized here

// Zustand store for managing user state
const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: "",

  // SignIn method
  signIn: async (email, password) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user, loading: false });
      return data.user;
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // SignUp method
  signUp: async (email, password, name, isSales = false) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (isSales) {
        await supabase.from("sales_agents").insert([
          {
            user_id: data.user.id,
            name: data.user.user_metadata.name,
          },
        ]);
      }

      set({ user: data.user, loading: false });
      return data.user; // Return user for further handling (like redirect)
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // SignOut method
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Fetch user from Supabase (using getSession)
  fetchUser: async () => {
    const { data: session, error } = await supabase.auth.getSession();
    if (error) {
      alert(error);
      set({ error: error.message, loading: false });
      return;
    }
    set({ user: session?.user || null, loading: false });
  },
}));

// Listen to auth state changes - updating Zustand store automatically when state changes
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.setState({ user: session?.user || null });
});

export default useAuthStore;
