"use client";
import { Button } from "@workspace/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative bg-black/70">
      <div className="container mx-auto px-4 py-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-white">Genie</span>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-sm">
              Transform your writing with AI-powered tools. Create, summarize, and enhance content in seconds with the
              most advanced writing assistant.
            </p>

            <div className="space-y-3">
              <h4 className="text-white font-semibold">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-400">
              <span className="text-sm">© 2025 Genie. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
