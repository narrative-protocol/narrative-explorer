"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs, ChainBadge, AttestationIndicator, TimeAgo, EmptyState } from "@/components/explorer-shared"
import { Globe, Boxes, Activity } from "lucide-react"
import type { SearchResults } from "@/lib/api"

export function SearchContent({
  query,
  results,
  error,
}: {
  query: string
  results: SearchResults | null
  error: string | null
}) {
  const totalResults = results
    ? (results.worlds?.length || 0) + (results.deployments?.length || 0) + (results.events?.length || 0)
    : 0

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Search Results {query && <span className="text-muted-foreground">for &ldquo;{query}&rdquo;</span>}
        </h1>
        {results && <p className="mt-1 text-sm text-muted-foreground">{totalResults} results found</p>}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
      )}

      {query.length < 2 && (
        <EmptyState message="Enter at least 2 characters to search" />
      )}

      {results && totalResults === 0 && <EmptyState message="No results found" />}

      {/* Worlds */}
      {results?.worlds && results.worlds.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Globe className="h-5 w-5 text-primary" /> Worlds
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {results.worlds.map((world) => (
              <Link
                key={world.id}
                href={`/worlds/${world.id}`}
                className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30"
              >
                <h3 className="font-semibold text-foreground">{world.name}</h3>
                {world.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{world.description}</p>}
                <div className="mt-2 flex flex-wrap gap-1">
                  {world.domainTags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Deployments */}
      {results?.deployments && results.deployments.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Boxes className="h-5 w-5 text-primary" /> Deployments
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {results.deployments.map((dep) => (
              <Link
                key={dep.id}
                href={`/deployments/${dep.id}`}
                className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30"
              >
                <h3 className="font-semibold text-foreground">{dep.name}</h3>
                {dep.worldName && <p className="mt-1 text-xs text-muted-foreground">{dep.worldName}</p>}
                <div className="mt-2 flex items-center gap-2">
                  <ChainBadge chain={dep.targetChain} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Events */}
      {results?.events && results.events.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Activity className="h-5 w-5 text-primary" /> Events
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Verification</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Executed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.events.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <Link href={`/events/${item.id}`} className="font-mono text-primary hover:underline">
                        {item.event?.name || item.eventName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <AttestationIndicator hasSolana={item.hasSolanaTx} hasNear={item.hasNearTx} />
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      <TimeAgo date={item.executedAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
