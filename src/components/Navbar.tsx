import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSrc from "@/assets/logo.png";

const navItems = [
  { label: "Features", hasDropdown: true },
  { label: "Solutions", hasDropdown: false },
  { label: "Plans", hasDropdown: false },
  { label: "Learning", hasDropdown: true },
];

const Navbar = () => {
  return (
    <div className="w-full">
      <nav className="w-full py-5 px-8 flex flex-row items-center justify-between">
        {/* Left: Logo */}
        <div className="shrink-0">
          <img src={logoSrc} alt="Logo" className="h-8 w-auto" width={32} height={32} />
        </div>

        {/* Center: Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="inline-flex items-center gap-1 px-3 py-2 text-base text-foreground/90 hover:text-foreground transition-colors rounded-md"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="w-4 h-4 opacity-60" />}
            </button>
          ))}
        </div>

        {/* Right: Sign Up */}
        <Button variant="heroSecondary" size="sm" className="rounded-full px-4 py-2">
          Sign Up
        </Button>
      </nav>

      {/* Gradient Divider */}
      <div className="mt-[3px] w-full h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </div>
  );
};

export default Navbar;
