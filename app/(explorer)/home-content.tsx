"use client";

import Link from "next/link";
import {
  Globe,
  Boxes,
  Activity,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import {
  StatCard,
  AttestationIndicator,
  TimeAgo,
  EmptyState,
} from "@/components/explorer-shared";
import type { GlobalStats } from "@/lib/api";

export function HomeContent({
  data,
  error,
}: {
  data: GlobalStats | null;
  error: string | null;
}) {
  if (error || !data) {
    return (
      <div className="space-y-8">
        <HeroBanner />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            label="Public Worlds"
            value="--"
            icon={<Globe className="h-4 w-4" />}
          />
          <StatCard
            label="Deployments"
            value="--"
            icon={<Boxes className="h-4 w-4" />}
          />
          <StatCard
            label="Total Events"
            value="--"
            icon={<Activity className="h-4 w-4" />}
          />
          <StatCard
            label="Total Entities"
            value="--"
            icon={<Users className="h-4 w-4" />}
          />
        </div>
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load data: {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HeroBanner />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Public Worlds"
          value={data.stats.publicWorlds}
          icon={<Globe className="h-4 w-4" />}
        />
        <StatCard
          label="Deployments"
          value={data.stats.publicDeployments}
          icon={<Boxes className="h-4 w-4" />}
        />
        <StatCard
          label="Total Events"
          value={data.stats.totalEvents}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label="Total Entities"
          value={data.stats.totalEntities}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <Link
            href="/events"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {data.recentActivity.length === 0 ? (
          <EmptyState message="No recent activity" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    World
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Deployment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Verification
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentActivity.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/events/${item.id}`}
                        className="font-mono text-primary hover:underline"
                      >
                        {item.eventName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/worlds/${item.worldId}`}
                        className="text-foreground hover:text-primary"
                      >
                        {item.worldName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/deployments/${item.deploymentId}`}
                        className="text-foreground hover:text-primary"
                      >
                        {item.deploymentName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <AttestationIndicator
                        hasAttestation={item.hasAttestation}
                        hasSolana={item.hasSolanaTx}
                        hasNear={item.hasNearTx}
                      />
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
  );
}

function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8">
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            World State & Event Engine
          </span>
        </div>
        <h1 className="text-3xl font-bold text-balance text-foreground md:text-4xl">
          Narrative Protocol Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Browse public game worlds, track deployment events, verify on-chain
          attestations, and inspect entity state changes across the Narrative
          Protocol ecosystem.
        </p>
      </div>
    </div>
  );
}
