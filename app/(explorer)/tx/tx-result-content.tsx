"use client"

import Link from "next/link"
import { Breadcrumbs, ExternalTxLink, EmptyState } from "@/components/explorer-shared"
import { ArrowRight } from "lucide-react"
import type { TxLookup } from "@/lib/api"

export function TxResultContent({
  data,
  error,
  chain,
  hash,
}: {
  data: TxLookup | null
  error: string | null
  chain: string
  hash: string
}) {
  if (error || !data) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Transaction Lookup", href: "/tx" },
          { label: `${chain.toUpperCase()} Tx` },
        ]} />
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error || "Transaction not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Transaction Lookup", href: "/tx" },
        { label: `${chain.toUpperCase()} Tx` },
      ]} />

      <div className="rounded-lg border border-border bg-card p-6">
        <h1 className="text-lg font-bold text-foreground">Transaction Found</h1>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Chain</span>
            <span className="font-mono text-foreground">{chain.toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hash / Signature</span>
            <span className="font-mono text-xs text-foreground break-all max-w-[50%] text-right">{hash}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Deployment</span>
            <Link href={`/deployments/${data.deployment.id}`} className="text-primary hover:underline">
              {data.deployment.name}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Event</span>
            <span className="font-mono text-foreground">{data.event.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Executed At</span>
            <span className="text-foreground">{new Date(data.executedAt).toLocaleString()}</span>
          </div>
          {data.solana && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Solana Explorer</span>
              <ExternalTxLink url={data.solana.explorerUrl} label="View on Solana" />
            </div>
          )}
          {data.near && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">NEAR Explorer</span>
              <ExternalTxLink url={data.near.explorerUrl} label="View on NEAR" />
            </div>
          )}
        </div>
        <div className="mt-6">
          <Link
            href={`/events/${data.historyId}`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View Full Event Detail <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
