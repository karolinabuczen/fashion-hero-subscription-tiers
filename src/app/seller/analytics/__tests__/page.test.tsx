import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SellerAnalyticsPage from "../page";

// Mockujemy nawigację Next.js
const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

// Mockujemy recharts, bo nie renderuje się w środowisku testowym (brak canvas/SVG)
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-line">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-bar">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-pie">{children}</div>,
  Line: () => null,
  Bar: () => null,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// Mockujemy auth-provider na poziomie modułu
const mockUseAuth = jest.fn();
jest.mock("@/components/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mockujemy fetch API
global.fetch = jest.fn();

type MockUser = {
  email: string;
  firstName: string;
  lastName: string;
  isSeller: boolean;
} | null;

function setUser(user: MockUser) {
  mockUseAuth.mockReturnValue({
    user,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  });
}

describe("SellerAnalyticsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("niezalogowany użytkownik jest przekierowywany na /account/login", () => {
    setUser(null);
    render(<SellerAnalyticsPage />);
    expect(mockReplace).toHaveBeenCalledWith("/account/login");
  });

  it("zalogowany użytkownik bez isSeller jest przekierowywany na /", () => {
    setUser({ email: "zwykly@example.com", firstName: "Jan", lastName: "K", isSeller: false });
    render(<SellerAnalyticsPage />);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("aktywny sprzedawca widzi 4 wykresy i CTA", () => {
    setUser({ email: "anna@avintage.pl", firstName: "Anna", lastName: "", isSeller: true });
    render(<SellerAnalyticsPage />);

    expect(screen.getByTestId("chart-line")).toBeInTheDocument();
    expect(screen.getAllByTestId("chart-bar")).toHaveLength(2);
    expect(screen.getByTestId("chart-pie")).toBeInTheDocument();
    expect(screen.getAllByText("Zapisz się na pilot").length).toBeGreaterThan(0);
  });

  it("kliknięcie CTA pokazuje formularz z polami email i firma", () => {
    setUser({ email: "anna@avintage.pl", firstName: "Anna", lastName: "", isSeller: true });
    render(<SellerAnalyticsPage />);

    fireEvent.click(screen.getAllByText("Zapisz się na pilot")[0]);

    expect(screen.getByLabelText(/nazwa firmy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/adres e-mail/i)).toBeInTheDocument();
  });

  it("submit z pustymi polami pokazuje błąd walidacji", () => {
    setUser({ email: "anna@avintage.pl", firstName: "Anna", lastName: "", isSeller: true });
    render(<SellerAnalyticsPage />);

    fireEvent.click(screen.getAllByText("Zapisz się na pilot")[0]);
    fireEvent.submit(screen.getByRole("button", { name: /zapisz się na pilot/i }).closest("form")!);

    expect(screen.getByText("Uzupełnij wszystkie pola.")).toBeInTheDocument();
  });

  it("poprawny submit wysyła dane i pokazuje ekran dziękujemy", async () => {
    setUser({ email: "anna@avintage.pl", firstName: "Anna", lastName: "", isSeller: true });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<SellerAnalyticsPage />);
    fireEvent.click(screen.getAllByText("Zapisz się na pilot")[0]);

    fireEvent.change(screen.getByLabelText(/nazwa firmy/i), { target: { value: "Anna's Vintage" } });
    fireEvent.change(screen.getByLabelText(/adres e-mail/i), { target: { value: "anna@avintage.pl" } });
    fireEvent.submit(screen.getByRole("button", { name: /zapisz się na pilot/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/dziękujemy/i)).toBeInTheDocument();
      expect(screen.getByText(/odezwiemy się do ciebie w ciągu 14 dni/i)).toBeInTheDocument();
    });
  });
});
