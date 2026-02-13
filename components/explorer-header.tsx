"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Globe,
  Boxes,
  Activity,
  FileCode2,
  Link2,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home", icon: Globe },
  { href: "/worlds", label: "Worlds", icon: Boxes },
  { href: "/deployments", label: "Deployments", icon: FileCode2 },
  { href: "/events", label: "Events", icon: Activity },
  { href: "/tx", label: "Tx Lookup", icon: Link2 },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          pathname === link.href ||
          (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function ExplorerHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  }

  const searchInput = (className?: string) => (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search worlds, events, tx..."
        className="h-9 w-full rounded-md border border-border bg-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 lg:gap-8 shrink-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                N
              </span>
            </div>
            <span className="text-lg font-semibold text-foreground truncate">
              Narrative <span className="text-primary">Explorer</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLinks pathname={pathname} />
          </nav>
        </div>
        <form
          onSubmit={handleSearch}
          className="relative hidden lg:block w-64 shrink-0"
        >
          {searchInput()}
        </form>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(20rem,85vw)] flex flex-col p-0"
          >
            <SheetHeader className="border-b border-border px-4 py-3 text-left">
              <SheetTitle className="text-base font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSearch} className="px-4 pt-3">
              {searchInput()}
            </form>
            <nav className="flex flex-col gap-0.5 p-3 pt-2">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setMenuOpen(false)}
              />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
