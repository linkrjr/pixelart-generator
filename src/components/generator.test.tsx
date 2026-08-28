import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Generator } from "@/components/generator";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const IMAGE = "data:image/svg+xml;base64,abc";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("Generator", () => {
  it("renders the form with a disabled submit button", () => {
    render(<Generator />);
    expect(screen.getByLabelText(/describe your image/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate/i })).toBeDisabled();
  });

  it("enables submit once a prompt is entered", async () => {
    render(<Generator />);
    await userEvent.type(screen.getByLabelText(/describe your image/i), "a fox");
    expect(screen.getByRole("button", { name: /generate/i })).toBeEnabled();
  });

  it("shows the generated image with the prompt as alt text", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ image: IMAGE }),
    });

    render(<Generator />);
    await userEvent.type(screen.getByLabelText(/describe your image/i), "a fox");
    await userEvent.click(screen.getByRole("button", { name: /generate/i }));

    const img = await screen.findByRole("img", { name: "a fox" });
    expect(img).toHaveAttribute("src", IMAGE);
  });

  it("shows an error message when the request fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Could not generate an image. Try again." }),
    });

    render(<Generator />);
    await userEvent.type(screen.getByLabelText(/describe your image/i), "a fox");
    await userEvent.click(screen.getByRole("button", { name: /generate/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/could not generate/i);
    });
  });
});
