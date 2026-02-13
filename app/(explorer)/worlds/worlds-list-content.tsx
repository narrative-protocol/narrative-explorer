"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, EmptyState } from "@/components/explorer-shared";
import { Globe, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import type { WorldSummary, Paginated } from "@/lib/api";

export function WorldsListContent({
  result,
  error,
  currentPage,
}: {
  result: Paginated<WorldSummary> | null;
  error: string | null;
  currentPage: number;
}) {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Worlds" }]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Worlds</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Public game worlds on the Narrative Protocol
          </p>
        </div>
        {result && (
          <span className="text-sm text-muted-foreground">
            {result.pagination.total} worlds
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && result.data.length === 0 && (
        <EmptyState message="No public worlds found" />
      )}

      {result && result.data.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((world) => (
              <Link
                key={world.id}
                href={`/worlds/${world.id}`}
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-secondary/30"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {world.name}
                    </h3>
                    {world.address && (
                      <p
                        className="mt-0.5 font-mono text-xs text-muted-foreground"
                        title={world.address}
                      >
                        {truncateAddress(world.address)}
                      </p>
                    )}
                  </div>
                </div>
                {world.description && (
                  <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {world.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {world.domainTags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {world.publicDeploymentCount} deployment
                    {world.publicDeploymentCount !== 1 ? "s" : ""}
                  </span>
                  <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                </div>
              </Link>
            ))}
          </div>

          {result.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {currentPage > 1 && (
                <Link
                  href={`/worlds?page=${currentPage - 1}`}
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
                  href={`/worlds?page=${currentPage + 1}`}
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
  );
}
