// Re-exports the mock client from the mocked @/lib/supabase module.
// Test files must call jest.mock("@/lib/supabase") so Jest uses
// src/lib/__mocks__/supabase.ts, which exports mockSupabaseClient.
import type { mockSupabaseClient as MockType } from "@/lib/__mocks__/supabase";

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const mockSupabaseClient = require("@/lib/supabase")
  .mockSupabaseClient as typeof MockType;
