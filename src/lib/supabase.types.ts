import { Database } from './database.types';

// Export types from generated database types
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

// Helper type to get table row types
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];

// Helper type to get table insert types
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert'];

// Helper type to get table update types
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update'];

// Export commonly used types
export type User = TableRow<'users'>;
export type UserInsert = TableInsert<'users'>;
export type UserUpdate = TableUpdate<'users'>;

// Add more type exports as needed for other tables
