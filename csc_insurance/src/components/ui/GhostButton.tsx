import { Link } from "react-router-dom";

interface GhostButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function GhostButton({ to, children, variant = "primary" }: GhostButtonProps) {
  const base =
    "inline-block rounded-full px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300";

  const variants = {
    primary:
      "border border-accent-trust text-accent-trust hover:bg-accent-trust hover:text-white",
    secondary:
      "border border-primary/15 text-primary/60 hover:border-primary/30 hover:text-primary",
  };

  return (
    <Link to={to} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}
