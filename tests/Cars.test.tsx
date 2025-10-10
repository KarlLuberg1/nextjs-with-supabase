import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Page from "../app/cars/page";
import * as server from "../app/cars/serverside";

// vi.mock("@/lib/supabase/client", () => ({
//   createClient: vi.fn(() => ({
//     from: vi.fn(() => ({
//       select: vi.fn().mockResolvedValue({ data: [] }),
//     })),
//   })),
// }));

vi.mock("../app/cars/serverside", () => ({
  createCarServer: vi.fn(),
  deleteCarServer: vi.fn(),
}));

describe("Cars component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders and adds a car", async () => {
    (server.createCarServer as any).mockResolvedValue([
      { id: 1, make: "My car", model: "Hello world" },
    ]);

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText("make"), {
      target: { value: "My car" },
    });
    fireEvent.change(screen.getByPlaceholderText("model"), {
      target: { value: "Hello world" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add car/i }));

    await waitFor(() => {
      expect(screen.getByText("My car")).toBeInTheDocument();
    });
  });

  it("deletes a car", async () => {
    (server.createCarServer as any).mockResolvedValue([
      { id: 1, make: "To delete", model: "temp" },
    ]);
    (server.deleteCarServer as any).mockResolvedValue([]);

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText("make"), {
      target: { value: "To delete" },
    });
    fireEvent.change(screen.getByPlaceholderText("model"), {
      target: { value: "temp" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add car/i }));

    await waitFor(() =>
      expect(screen.getByText("To delete")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() =>
      expect(screen.queryByText("To delete")).not.toBeInTheDocument()
    );
  });
});
