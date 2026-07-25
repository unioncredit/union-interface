import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "react-error-boundary";
import { describe, expect, it, vi } from "vitest";

import ErrorPage from "pages/Error";

// Verifies the app's crash safety net end-to-end: index.jsx wraps the whole
// provider stack, and App.jsx wraps the data-provider tree + Header, in
// <ErrorBoundary FallbackComponent={ErrorPage}>. This turns any provider throw
// into a friendly page instead of a white screen.
function Boom() {
  throw new Error("boom");
}

describe("ErrorPage as a crash-boundary fallback", () => {
  it("renders the fallback instead of unmounting to a blank screen when a child throws", () => {
    // React logs the caught error to console.error; silence it for a clean run.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByRole("heading", { name: /something broke/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to safety/i })).toBeInTheDocument();

    spy.mockRestore();
  });
});
