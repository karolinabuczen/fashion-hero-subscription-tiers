"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { BarChart2 } from "lucide-react";

const mockOrders = [
  { id: "SF-10042", date: "March 15, 2026", status: "Delivered", total: 592 },
  { id: "SF-10038", date: "February 22, 2026", status: "Delivered", total: 940 },
  { id: "SF-10031", date: "January 8, 2026", status: "Delivered", total: 480 },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/account/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Account</span>
      </nav>

      <h1 className="text-2xl font-light text-charcoal mb-2">
        Hello, {user.firstName}
      </h1>
      <p className="text-[13px] text-warm-gray mb-10">
        Welcome back to your FashionHero account.
      </p>

      {/* Analytics CTA — widoczna tylko dla aktywnych sprzedawców */}
      {user.isSeller && (
        <section className="mb-10 bg-[var(--color-charcoal)] text-white px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <BarChart2 className="mt-0.5 shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium leading-snug">
                Twój panel analityczny jest gotowy
              </p>
              <p className="text-xs text-white/70 mt-0.5">
                Sprawdź dane sprzedaży, trendy i profil kupujących. Dołącz do pilota.
              </p>
            </div>
          </div>
          <Link
            href="/seller/analytics"
        className="btn-cta-outline text-[12px] w-full"
      >
        SIGN OUT
      </button>
    </div>
  );
}
