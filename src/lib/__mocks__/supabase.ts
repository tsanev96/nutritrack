export const mockSupabaseClient = {
  single: jest.fn(),
  from: jest.fn(),
  eq: jest.fn(),
  upsert: jest.fn(),
  select: jest.fn(),
  selectAll: jest.fn(),
};

export const supabase = mockSupabaseClient;
