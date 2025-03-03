import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase credentials. Make sure to click "Connect to Supabase" button to set up your database.'
  );
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// Error handler utility
export const handleSupabaseError = (error: any, customMessage?: string) => {
  console.error('Supabase error:', error);
  toast.error(customMessage || 'An error occurred');
  throw error;
};

// Type-safe database helpers
export const db = {
  // Example query helper with error handling
  async query<T>(
    callback: (client: typeof supabase) => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    try {
      const { data, error } = await callback(supabase);
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned');
      }
      
      return data;
    } catch (error) {
      handleSupabaseError(error);
      throw error; // Re-throw to be handled by caller
    }
  },

  // Example insert helper
  async insert<T>(
    table: string,
    data: Partial<T>,
    options: { returning?: boolean } = { returning: true }
  ) {
    return db.query(client =>
      client.from(table).insert(data).select(options.returning ? '*' : undefined)
    );
  },

  // Example select helper
  async select<T>(
    table: string,
    options: {
      columns?: string;
      where?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
      single?: boolean;
    } = {}
  ) {
    let query = supabase
      .from(table)
      .select(options.columns || '*');

    if (options.where) {
      Object.entries(options.where).forEach(([column, value]) => {
        query = query.eq(column, value);
      });
    }

    if (options.order) {
      query = query.order(
        options.order.column,
        { ascending: options.order.ascending ?? true }
      );
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.single) {
      query = query.single();
    }

    return db.query(() => query);
  },

  // Example update helper
  async update<T>(
    table: string,
    data: Partial<T>,
    match: Record<string, any>,
    options: { returning?: boolean } = { returning: true }
  ) {
    let query = supabase
      .from(table)
      .update(data);

    Object.entries(match).forEach(([column, value]) => {
      query = query.eq(column, value);
    });

    if (options.returning) {
      query = query.select();
    }

    return db.query(() => query);
  },

  // Example delete helper
  async delete(
    table: string,
    match: Record<string, any>,
    options: { returning?: boolean } = { returning: false }
  ) {
    let query = supabase
      .from(table)
      .delete();

    Object.entries(match).forEach(([column, value]) => {
      query = query.eq(column, value);
    });

    if (options.returning) {
      query = query.select();
    }

    return db.query(() => query);
  }
};

// Auth helpers
export const auth = {
  // Get current session
  getSession() {
    return supabase.auth.getSession();
  },

  // Get current user
  getUser() {
    return supabase.auth.getUser();
  },

  // Sign in with email/password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign in');
      throw error;
    }
  },

  // Sign up with email/password
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign up');
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign out');
      throw error;
    }
  }
};

// Storage helpers
export const storage = {
  // Upload file
  async upload(
    bucket: string,
    path: string,
    file: File,
    options: { upsert?: boolean } = { upsert: false }
  ) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: options.upsert });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to upload file');
      throw error;
    }
  },

  // Download file
  async download(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to download file');
      throw error;
    }
  },

  // Delete file
  async delete(bucket: string, paths: string[]) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(paths);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleSupabaseError(error, 'Failed to delete file(s)');
      throw error;
    }
  },

  // Get public URL
  getPublicUrl(bucket: string, path: string) {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path);
  }
};

// Real-time subscription helpers
export const realtime = {
  // Subscribe to table changes
  subscribe(
    table: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    callback: (payload: any) => void
  ) {
    return supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table
        },
        callback
      )
      .subscribe();
  }
};

export default {
  client: supabase,
  db,
  auth,
  storage,
  realtime
};
