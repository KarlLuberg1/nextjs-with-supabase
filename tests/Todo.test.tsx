import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import TodoPage from "../app/todo/page";
import * as server from "../app/todo/serverside";

vi.mock("../app/todo/serverside", () => ({
  createTodoServer: vi.fn(),
  deleteTodoServer: vi.fn(),
  updateTodoServer: vi.fn(),
  toggleTodoCompleteServer: vi.fn(),
}));

describe("TODO component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders and adds a todo", async () => {
    (server.createTodoServer as any).mockResolvedValue([
      {
        id: 2,
        title: "Test Todo",
        content: "Finish tests",
        iscompleted: false,
      },
    ]);

    render(<TodoPage />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Test Todo" },
    });
    fireEvent.change(screen.getByPlaceholderText("Content"), {
      target: { value: "Finish tests" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));

    await waitFor(() =>
      expect(screen.getByText("Test Todo")).toBeInTheDocument()
    );
  });

  it("toggles a todo as completed", async () => {
    const mockTodo = {
      id: 2,
      title: "Toggle me",
      content: "click me",
      iscompleted: false,
    };

    (server.createTodoServer as any).mockResolvedValue([mockTodo]);
    (server.toggleTodoCompleteServer as any).mockResolvedValue([
      { ...mockTodo, iscompleted: true },
    ]);

    render(<TodoPage />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Toggle me" },
    });
    fireEvent.change(screen.getByPlaceholderText("Content"), {
      target: { value: "click me" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));

    await waitFor(() =>
      expect(screen.getByText("Toggle me")).toBeInTheDocument()
    );

    const checkbox = await screen.findByRole("checkbox");

    fireEvent.click(checkbox);

    await waitFor(() => expect(checkbox).toBeChecked());
  });

  it("deletes a todo", async () => {
    (server.createTodoServer as any).mockResolvedValue([
      { id: 2, title: "To delete", content: "remove me", iscompleted: false },
    ]);
    (server.deleteTodoServer as any).mockResolvedValue([]);

    render(<TodoPage />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "To delete" },
    });
    fireEvent.change(screen.getByPlaceholderText("Content"), {
      target: { value: "remove me" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add todo/i }));

    await waitFor(() =>
      expect(screen.getByText("To delete")).toBeInTheDocument()
    );

    const deleteButton = await screen.findByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(screen.queryByText("To delete")).not.toBeInTheDocument()
    );
  });
});
