"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Globe, Boxes, Activity, FileCode2, Link2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home", icon: Globe },
  { href: "/worlds", label: "Worlds", icon: Boxes },
  { href: "/deployments", label: "Deployments", icon: FileCode2 },
  { href: "/events", label: "Events", icon: Activity },
  { href: "/tx", label: "Tx Lookup", icon: Link2 },
]

export function ExplorerHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Narrative <span className="text-primary">Explorer</span></span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <form onSubmit={handleSearch} className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search worlds, events, tx..."
            className="h-9 w-64 rounded-md border border-border bg-secondary pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>
      </div>
    </header>
  )
}
