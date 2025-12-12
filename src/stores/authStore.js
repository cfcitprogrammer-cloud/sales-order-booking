import { create } from "zustand";
import { supabase } from "../supabase"; // Assuming supabase is initialized here

// Zustand store for managing user state
const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: "",
  role: null, // Add state to store the role

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
  signUp: async (email, password, name) => {
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
      set({ user: null, role: null }); // Clear user and role on signout
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

  // New method to get role from app_metadata
  getRole: () => {
    set((state) => {
      if (state.user && state.user.app_metadata) {
        // Extract the role from app_metadata
        const role = state.user.app_metadata?.role || null;
        return { role }; // Set the role in the store
      }
      return { role: null }; // Return null if no role found
    });
  },
}));

// Listen to auth state changes - updating Zustand store automatically when state changes
supabase.auth.onAuthStateChange((event, session) => {
  // When the auth state changes, set the user and extract role from app_metadata
  useAuthStore.setState({
    user: session?.user || null,
  });

  // Extract role from user app_metadata
  if (session?.user?.app_metadata) {
    const role = session.user.app_metadata?.role || null;
    useAuthStore.setState({ role });
  }
});

export default useAuthStore;
