import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const shopLinks = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Accessories", href: "/accessories" },
];

const maisonLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Careers", href: "/careers" },
];

const careLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Store Locator", href: "/stores" },
];

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-offwhite">
      <div className="px-6 md:px-20 py-16">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="font-heading text-[22px] font-bold tracking-[4px]">
              MAISON ÉLÉGANCE
            </Link>
            <p className="text-sm text-brand-offwhite/60 leading-relaxed">
              Where timeless craftsmanship meets
              contemporary vision. Since 1987.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-brand-gold hover:text-brand-gold/80 transition-colors" aria-label="Instagram">
                <Instagram className="h-[18px] w-[18px]" />
              </a>
              <a href="#" className="text-brand-offwhite/40 hover:text-brand-offwhite/60 transition-colors" aria-label="Facebook">
                <Facebook className="h-[18px] w-[18px]" />
              </a>
              <a href="#" className="text-brand-offwhite/40 hover:text-brand-offwhite/60 transition-colors" aria-label="Twitter">
                <Twitter className="h-[18px] w-[18px]" />
              </a>
              <a href="#" className="text-brand-offwhite/40 hover:text-brand-offwhite/60 transition-colors" aria-label="YouTube">
                <Youtube className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-16 lg:gap-20">
            <FooterColumn title="SHOP" links={shopLinks} />
            <FooterColumn title="MAISON" links={maisonLinks} />
            <FooterColumn title="CLIENT CARE" links={careLinks} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-brand-offwhite/8 my-10" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-offwhite/27">
            &copy; {new Date().getFullYear()} Maison &Eacute;l&eacute;gance. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-brand-offwhite/27 hover:text-brand-offwhite/50 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-brand-offwhite/27 hover:text-brand-offwhite/50 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-xs text-brand-offwhite/27 hover:text-brand-offwhite/50 transition-colors">
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      <h3 className="text-[11px] font-semibold text-brand-gold tracking-[3px]">{title}</h3>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[13px] text-brand-offwhite/60 hover:text-brand-offwhite/80 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
