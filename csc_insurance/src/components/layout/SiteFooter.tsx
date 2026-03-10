import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Disclosure", path: "/disclosure-statement" },
  { label: "Privacy", path: "/privacy-policy" },
  { label: "Contact", path: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border-light">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-6 px-6 py-12 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold tracking-tighter">CSC Insurance</p>
          <p className="mt-1 text-xs text-primary/40">
            4168 Finch Ave E, Suite 218, Scarborough, ON
          </p>
        </div>

        {/* Links */}
        <ul className="flex gap-6">
          {footerLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="text-xs text-primary/40 transition-colors hover:text-primary/70"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <p className="text-xs text-primary/30">
          &copy; {new Date().getFullYear()} CSC Insurance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
