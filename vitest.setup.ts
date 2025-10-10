import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            {
              id: 1,
              title: "Mocked item",
              content: "mock content",
              iscompleted: false,
            },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({ data: [], error: null })),
      delete: vi.fn(() => ({ data: [], error: null })),
      update: vi.fn(() => ({ data: [], error: null })),
    })),
  })),
}));
