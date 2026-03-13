"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "@/components/cart-sheet";
import { useCartStore } from "@/store/cart-store";

const navLinks = [
  { label: "NEW ARRIVALS", href: "/collections/summer-in-santorini" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "WOMEN", href: "/collections/bohemian-dreams" },
  { label: "MEN", href: "/collections/urban-noir" },
  { label: "ACCESSORIES", href: "/collections/bohemian-dreams" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);
  const count = totalItems();

  return (
    <header className="sticky top-0 z-50 bg-brand-black">
      {/* Desktop Nav */}
      <nav className="flex h-20 items-center justify-between px-6 md:px-[60px]">
        {/* Left: Logo + Links */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="font-heading text-[22px] font-bold text-brand-offwhite tracking-[4px]"
          >
            MAISON ÉLÉGANCE
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-medium text-brand-offwhite tracking-brand hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Icons + CTA */}
        <div className="flex items-center gap-6">
          <button
            className="text-brand-offwhite hover:text-brand-gold transition-colors hidden sm:block"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/wishlist"
            className="text-brand-offwhite hover:text-brand-gold transition-colors hidden sm:block"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Cart with Sheet */}
          <CartSheet>
            <span className="relative text-brand-offwhite hover:text-brand-gold transition-colors cursor-pointer">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <Badge className="absolute -top-2 -right-2.5 h-4 min-w-4 px-1 flex items-center justify-center bg-brand-gold text-[10px] font-semibold text-brand-black rounded-full border-0">
                  {count}
                </Badge>
              )}
            </span>
          </CartSheet>

          <Link
            href="/try-on"
            className="hidden md:flex items-center gap-2 bg-brand-gold px-6 py-2.5 text-xs font-semibold text-brand-black tracking-brand hover:bg-brand-gold-hover transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            TRY IT ON
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-brand-offwhite"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-black border-t border-white/10 px-6 pb-6">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-brand-offwhite/80 tracking-brand hover:text-brand-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/try-on"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-brand-gold px-6 py-3 mt-2 text-xs font-semibold text-brand-black tracking-brand"
            >
              <Sparkles className="h-3.5 w-3.5" />
              VIRTUAL TRY-ON
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
