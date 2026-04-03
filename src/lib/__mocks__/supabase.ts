export const mockUnsubscribe = jest.fn();

export const mockSupabaseClient = {
  single: jest.fn(),
  from: jest.fn(),
  eq: jest.fn(),
  upsert: jest.fn(),
  select: jest.fn(),
  selectAll: jest.fn(),
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
};

export const supabase = mockSupabaseClient;
