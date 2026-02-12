"use client"

import Link from "next/link"
import { Breadcrumbs, JsonBlock, TimeAgo, EmptyState } from "@/components/explorer-shared"
import { Database, Link2, History } from "lucide-react"
import type { EntityDetail } from "@/lib/api"

export function EntityDetailContent({ data, error }: { data: EntityDetail | null; error: string | null }) {
  if (error || !data) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Entity", href: "#" }, { label: "Error" }]} />
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error || "Entity not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: data.deployment.world.name, href: `/worlds/${data.deployment.world.id}` },
        { label: data.deployment.name, href: `/deployments/${data.deployment.id}` },
        { label: data.instanceId },
      ]} />

      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">{data.instanceId}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Schema: <span className="font-mono text-foreground">{data.schema.name}</span>
              {data.schema.description && <span> - {data.schema.description}</span>}
            </p>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <Link href={`/deployments/${data.deployment.id}`} className="flex items-center gap-1 text-primary hover:underline">
                <Link2 className="h-3 w-3" /> {data.deployment.name}
              </Link>
              <span className="text-border">|</span>
              <span className="text-muted-foreground">Created: {new Date(data.createdAt).toLocaleDateString()}</span>
              <span className="text-border">|</span>
              <span className="text-muted-foreground">Updated: <TimeAgo date={data.updatedAt} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Current State */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Current State</h2>
        <JsonBlock data={data.currentState} />
      </section>

      {/* Schema Attributes */}
      {data.schema.attributes && data.schema.attributes.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Schema Attributes</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Attribute</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.schema.attributes.map((attr) => (
                  <tr key={attr.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-foreground">{attr.name}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{attr.type}</td>
                    <td className="px-4 py-3 text-right font-mono text-primary">
                      {String(data.currentState[attr.name] ?? "--")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Change History */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <History className="h-5 w-5 text-primary" /> Change History
        </h2>
        {data.changeHistory.length === 0 ? (
          <EmptyState message="No change history" />
        ) : (
          <div className="space-y-3">
            {data.changeHistory.map((change) => (
              <div key={change.historyId} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Link href={`/events/${change.historyId}`} className="font-mono text-sm text-primary hover:underline">
                    {change.eventName}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    <TimeAgo date={change.executedAt} />
                  </span>
                </div>
                <JsonBlock data={change.changes} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
