import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Page from "../app/notes/page";
import * as server from "../app/notes/serverside";

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [] }),
    })),
  })),
}));

vi.mock("../app/notes/serverside", () => ({
  createNoteServer: vi.fn(),
  deleteNoteServer: vi.fn(),
}));

describe("Notes component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders and adds a note", async () => {
    (server.createNoteServer as any).mockResolvedValue([
      { id: 1, title: "My note", content: "Hello world" },
    ]);

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "My note" },
    });
    fireEvent.change(screen.getByPlaceholderText("Content"), {
      target: { value: "Hello world" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add note/i }));

    await waitFor(() => {
      expect(screen.getByText("My note")).toBeInTheDocument();
    });
  });

  it("deletes a note", async () => {
    (server.createNoteServer as any).mockResolvedValue([
      { id: 1, title: "To delete", content: "temp" },
    ]);
    (server.deleteNoteServer as any).mockResolvedValue([]);

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "To delete" },
    });
    fireEvent.change(screen.getByPlaceholderText("Content"), {
      target: { value: "temp" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add note/i }));

    await waitFor(() =>
      expect(screen.getByText("To delete")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() =>
      expect(screen.queryByText("To delete")).not.toBeInTheDocument()
    );
  });
});
