"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumbs,
  ChainBadge,
  ModeBadge,
  EmptyState,
} from "@/components/explorer-shared";
import { Boxes, FileCode2, Database, ArrowRight } from "lucide-react";
import { truncateAddress } from "@/lib/utils";
import type { WorldDetail } from "@/lib/api";

export function WorldDetailContent({
  data,
  error,
}: {
  data: WorldDetail | null;
  error: string | null;
}) {
  if (error || !data) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Worlds", href: "/worlds" },
            { label: "Error" },
          ]}
        />
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error || "World not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Worlds", href: "/worlds" },
          { label: data.name },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-foreground">{data.name}</h1>
        {data.address && (
          <p
            className="mt-1 font-mono text-sm text-muted-foreground"
            title={data.address}
          >
            {data.address}
          </p>
        )}
        {data.description && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {data.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {data.domainTags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Entity Schemas */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Database className="h-5 w-5 text-primary" /> Entity Schemas
        </h2>
        {data.entitySchemas.length === 0 ? (
          <EmptyState message="No entity schemas defined" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.entitySchemas.map((schema) => (
              <div
                key={schema.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h3 className="font-mono font-semibold text-foreground">
                  {schema.name}
                </h3>
                {schema.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {schema.description}
                  </p>
                )}
                <div className="mt-3 space-y-1">
                  {schema.attributeDefinitions.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex items-center justify-between rounded bg-secondary/50 px-2 py-1 text-xs"
                    >
                      <span className="font-mono text-foreground">
                        {attr.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono"
                      >
                        {attr.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Events */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <FileCode2 className="h-5 w-5 text-primary" /> Events
        </h2>
        {data.events.length === 0 ? (
          <EmptyState message="No events defined" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Versions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.events.map((event) => (
                  <tr key={event.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-primary">
                      {event.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {event.description}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                      {event.versions.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Public Deployments */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Boxes className="h-5 w-5 text-primary" /> Public Deployments
        </h2>
        {data.publicDeployments.length === 0 ? (
          <EmptyState message="No public deployments" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.publicDeployments.map((dep) => (
              <Link
                key={dep.id}
                href={`/deployments/${dep.id}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30"
              >
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {dep.name}
                  </h3>
                  {dep.address && (
                    <p
                      className="mt-1 font-mono text-xs text-muted-foreground"
                      title={dep.address}
                    >
                      {truncateAddress(dep.address)}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    {dep.targetChains?.map((chain) => (
                      <ChainBadge key={chain} chain={chain} />
                    ))}
                    <ModeBadge mode={dep.mode} />
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
