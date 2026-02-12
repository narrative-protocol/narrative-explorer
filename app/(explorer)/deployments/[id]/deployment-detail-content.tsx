"use client"

import Link from "next/link"
import { Breadcrumbs, ChainBadge, ModeBadge, StatCard, AttestationIndicator, TimeAgo, EmptyState } from "@/components/explorer-shared"
import { Boxes, Activity, Users, Link2 } from "lucide-react"
import type { DeploymentDetail, EntityInstance, EventHistoryItem, Paginated } from "@/lib/api"

export function DeploymentDetailContent({
  data,
  entities,
  history,
  error,
}: {
  data: DeploymentDetail | null
  entities: Paginated<EntityInstance> | null
  history: EventHistoryItem[] | null
  error: string | null
}) {
  if (error || !data) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Deployments", href: "/deployments" }, { label: "Error" }]} />
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error || "Deployment not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Deployments", href: "/deployments" },
        { label: data.name },
      ]} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">{data.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <ChainBadge chain={data.targetChain} />
          <ModeBadge mode={data.mode} />
          {data.lockedAt && (
            <span className="text-xs text-muted-foreground">Locked: {new Date(data.lockedAt).toLocaleDateString()}</span>
          )}
        </div>
        <div className="mt-2">
          <Link href={`/worlds/${data.world.id}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
            <Link2 className="h-3 w-3" /> {data.world.name}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Entities" value={data.stats.entityInstanceCount} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Events Executed" value={data.stats.eventHistoryCount} icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Event Bindings" value={data.eventBindings.length} icon={<Boxes className="h-4 w-4" />} />
        <StatCard label="Target Chain" value={data.targetChain} icon={<Link2 className="h-4 w-4" />} />
      </div>

      {/* Event Bindings */}
      {data.eventBindings.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Event Bindings</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Version</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.eventBindings.map((binding) => (
                  <tr key={binding.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-primary">{binding.event.name}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">v{binding.eventVersion.version}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {new Date(binding.eventVersion.publishedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Entities */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Entity Instances</h2>
        {!entities || entities.data.length === 0 ? (
          <EmptyState message="No entity instances" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Instance ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Schema</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entities.data.map((entity) => (
                  <tr key={entity.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <Link href={`/entities/${entity.id}`} className="font-mono text-primary hover:underline">
                        {entity.instanceId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{entity.schemaName}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      <TimeAgo date={entity.updatedAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Event History */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Event History</h2>
        {!history || (Array.isArray(history) && history.length === 0) ? (
          <EmptyState message="No event history" />
        ) : (
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
                {(Array.isArray(history) ? history : []).map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <Link href={`/events/${item.id}`} className="font-mono text-primary hover:underline">
                        {item.eventName}
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
        )}
      </section>
    </div>
  )
}
