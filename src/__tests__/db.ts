// Re-exports the mock client from the mocked @/lib/supabase module.
// Test files must call jest.mock("@/lib/supabase") so Jest uses
// src/lib/__mocks__/supabase.ts, which exports mockSupabaseClient.
// @ts-ignore — mockSupabaseClient only exists on the jest manual mock at src/lib/__mocks__/supabase.ts
export { mockSupabaseClient } from "@/lib/supabase";
