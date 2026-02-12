"use client"

import Link from "next/link"
import { Breadcrumbs, AttestationIndicator, TimeAgo, EmptyState } from "@/components/explorer-shared"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { EventHistoryItem, Paginated } from "@/lib/api"

export function EventsListContent({
  result,
  error,
  currentPage,
}: {
  result: Paginated<EventHistoryItem> | null
  error: string | null
  currentPage: number
}) {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">All event executions across public deployments</p>
        </div>
        {result && (
          <span className="text-sm text-muted-foreground">{result.pagination.total} events</span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
      )}

      {result && result.data.length === 0 && <EmptyState message="No events found" />}

      {result && result.data.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">World</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Deployment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Verification</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Executed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.data.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <Link href={`/events/${item.id}`} className="font-mono text-primary hover:underline">
                        {item.event?.name || item.eventName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {item.world ? (
                        <Link href={`/worlds/${item.world.id}`} className="text-muted-foreground hover:text-primary">
                          {item.world.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.deployment ? (
                        <Link href={`/deployments/${item.deployment.id}`} className="text-muted-foreground hover:text-primary">
                          {item.deployment.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
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

          {result.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {currentPage > 1 && (
                <Link
                  href={`/events?page=${currentPage - 1}`}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {result.pagination.totalPages}
              </span>
              {currentPage < result.pagination.totalPages && (
                <Link
                  href={`/events?page=${currentPage + 1}`}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
