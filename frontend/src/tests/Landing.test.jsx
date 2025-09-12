import { render, screen, cleanup, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, afterEach } from "vitest";
import Index from "../pages/landing/landingPage.jsx";

// helper to render with router
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

afterEach(() => {
  cleanup();
});

describe("Index (Home) Page", () => {
  test("1. Renders hero heading", () => {
    renderWithRouter(<Index />);
    const heading = screen.getByRole("heading", { name: /welcome to troop/i });
    expect(heading).toBeTruthy();
  });

  test("2. Renders 'Get Started' button (hero section)", () => {
    renderWithRouter(<Index />);
    const heroHeading = screen.getByRole("heading", { name: /welcome to troop/i });
    const heroSection = heroHeading.closest("section");
    const scope = within(heroSection);
    const btn = scope.getByRole("button", { name: /get started/i });
    expect(btn).toBeTruthy();
  });

  test("3. Renders feature section items (Lounge, Angaadi, Thrift)", () => {
    renderWithRouter(<Index />);
    const featuresHeading = screen.getByRole("heading", {
      name: /everything you need/i,
    });
    const featuresSection = featuresHeading.closest("section");
    const scope = within(featuresSection);
    expect(scope.getByText(/Lounge/i)).toBeTruthy();
    expect(scope.getByText(/Angaadi/i)).toBeTruthy();
    expect(scope.getByText(/Thrift/i)).toBeTruthy();
  });

  test("4. Renders 7 feature cards with headings", () => {
    renderWithRouter(<Index />);
    const featuresHeading = screen.getByRole("heading", {
      name: /everything you need/i,
    });
    const featuresSection = featuresHeading.closest("section");
    const scope = within(featuresSection);
    const featureHeadings = scope.getAllByRole("heading", { level: 3 });
    expect(featureHeadings).toHaveLength(7);
  });

  test("5. Renders testimonials quotes", () => {
    renderWithRouter(<Index />);
    const testimonialsHeading = screen.getByRole("heading", {
      name: /student voices/i,
    });
    const testimonialsSection = testimonialsHeading.closest("section");
    const scope = within(testimonialsSection);
    expect(scope.getByText(/best way to build networks around college!/i)).toBeTruthy();
    expect(scope.getByText(/loved shopping on angaadi!/i)).toBeTruthy();
  });
});
