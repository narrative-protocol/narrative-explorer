"use client";

import Link from "next/link";
import {
  Breadcrumbs,
  ChainBadge,
  ModeBadge,
  EmptyState,
} from "@/components/explorer-shared";
import { truncateAddress } from "@/lib/utils";
import { Boxes, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { DeploymentSummary, Paginated } from "@/lib/api";

export function DeploymentsListContent({
  result,
  error,
  currentPage,
}: {
  result: Paginated<DeploymentSummary> | null;
  error: string | null;
  currentPage: number;
}) {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Deployments" }]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deployments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Public deployments across all worlds
          </p>
        </div>
        {result && (
          <span className="text-sm text-muted-foreground">
            {result.pagination.total} deployments
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && result.data.length === 0 && (
        <EmptyState message="No public deployments found" />
      )}

      {result && result.data.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    World
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Chain
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Mode
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.data.map((dep) => (
                  <tr
                    key={dep.id}
                    className="transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/deployments/${dep.id}`}
                        className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
                      >
                        <Boxes className="h-4 w-4 text-primary" />
                        {dep.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {dep.address ? (
                        <span
                          className="font-mono text-xs text-muted-foreground"
                          title={dep.address}
                        >
                          {truncateAddress(dep.address)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {dep.worldId ? (
                        <Link
                          href={`/worlds/${dep.worldId}`}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {dep.worldName}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {dep.targetChains?.map((chain) => (
                          <ChainBadge key={chain} chain={chain} />
                        ))}
                        {(!dep.targetChains ||
                          dep.targetChains.length === 0) && (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ModeBadge mode={dep.mode} />
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {dep.createdAt
                        ? new Date(dep.createdAt).toLocaleDateString()
                        : "--"}
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
                  href={`/deployments?page=${currentPage - 1}`}
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
                  href={`/deployments?page=${currentPage + 1}`}
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
