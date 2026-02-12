"use client"

import Link from "next/link"
import { Breadcrumbs, ChainBadge, ExternalTxLink, JsonBlock } from "@/components/explorer-shared"
import { ShieldCheck, FileCode2, ArrowRightLeft, CheckCircle2, Link2 } from "lucide-react"
import type { EventDetail } from "@/lib/api"

export function EventDetailContent({ data, error }: { data: EventDetail | null; error: string | null }) {
  if (error || !data) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }, { label: "Error" }]} />
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error || "Event not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
        { label: `#${data.id} ${data.event.name}` },
      ]} />

      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold font-mono text-foreground">{data.event.name}</h1>
            </div>
            {data.event.description && (
              <p className="text-sm text-muted-foreground">{data.event.description}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Link href={`/worlds/${data.deployment.world.id}`} className="flex items-center gap-1 text-primary hover:underline">
                <Link2 className="h-3 w-3" /> {data.deployment.world.name}
              </Link>
              <span className="text-border">|</span>
              <Link href={`/deployments/${data.deployment.id}`} className="flex items-center gap-1 text-primary hover:underline">
                <Link2 className="h-3 w-3" /> {data.deployment.name}
              </Link>
              <span className="text-border">|</span>
              <ChainBadge chain={data.deployment.targetChain} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Event Version</p>
            <p className="font-mono text-sm text-foreground">v{data.eventVersion.version}</p>
            <p className="mt-2 text-xs text-muted-foreground">Executed At</p>
            <p className="font-mono text-sm text-foreground">{new Date(data.execution.executedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Execution Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowRightLeft className="h-4 w-4" /> Input
          </h2>
          <JsonBlock data={data.execution.input} />
        </section>
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" /> Result
          </h2>
          <JsonBlock data={data.execution.result} />
        </section>
      </div>

      {/* State Changes */}
      {data.execution.stateChanges && Object.keys(data.execution.stateChanges).length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowRightLeft className="h-4 w-4" /> State Changes
          </h2>
          <JsonBlock data={data.execution.stateChanges} />
        </section>
      )}

      {/* Attestation */}
      {data.attestation && (
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
            <ShieldCheck className="h-5 w-5" /> Attestation
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">Signing Algorithm</span>
              <p className="font-mono text-foreground">{data.attestation.signingAlgo}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Signing Address</span>
              <p className="break-all font-mono text-foreground">{data.attestation.signingAddress}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Signature</span>
              <p className="break-all font-mono text-xs text-foreground">{data.attestation.signature}</p>
            </div>
            {data.attestation.text && (
              <div>
                <span className="text-xs text-muted-foreground">Attestation Text</span>
                <p className="text-foreground">{data.attestation.text}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* On-Chain Records */}
      {(data.onChain.solana || data.onChain.near) && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">On-Chain Records</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.onChain.solana && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">Solana</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Transaction</span>
                    <div className="mt-0.5">
                      <ExternalTxLink url={data.onChain.solana.explorerUrl} label={data.onChain.solana.signature.slice(0, 16) + "..."} />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Event Record PDA</span>
                    <p className="break-all font-mono text-xs text-foreground">{data.onChain.solana.eventRecordPda}</p>
                  </div>
                </div>
              </div>
            )}
            {data.onChain.near && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">NEAR</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Transaction</span>
                    <div className="mt-0.5">
                      <ExternalTxLink url={data.onChain.near.explorerUrl} label={data.onChain.near.txHash.slice(0, 16) + "..."} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
