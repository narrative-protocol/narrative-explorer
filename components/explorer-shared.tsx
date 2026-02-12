import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ShieldCheck, CircleDot } from "lucide-react"

export function ChainBadge({ chain }: { chain: string }) {
  return (
    <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary font-mono text-xs">
      {chain}
    </Badge>
  )
}

export function ModeBadge({ mode }: { mode: string }) {
  return (
    <Badge variant="secondary" className="font-mono text-xs">
      {mode}
    </Badge>
  )
}

export function AttestationIndicator({ hasAttestation, hasSolana, hasNear }: { hasAttestation?: boolean; hasSolana: boolean; hasNear: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {hasAttestation && (
        <span title="Attested" className="text-primary">
          <ShieldCheck className="h-4 w-4" />
        </span>
      )}
      {hasSolana && (
        <Badge variant="outline" className="h-5 border-chart-1/40 bg-chart-1/10 px-1.5 text-[10px] font-mono text-chart-1">
          SOL
        </Badge>
      )}
      {hasNear && (
        <Badge variant="outline" className="h-5 border-chart-2/40 bg-chart-2/10 px-1.5 text-[10px] font-mono text-chart-2">
          NEAR
        </Badge>
      )}
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-primary font-mono">{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <CircleDot className="mb-3 h-8 w-8" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export function ExternalTxLink({ url, label }: { url: string; label: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-mono">
      {label}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}

export function JsonBlock({ data }: { data: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-secondary p-3 text-xs font-mono text-foreground leading-relaxed">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

export function TimeAgo({ date }: { date: string }) {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)
  if (seconds < 60) return <span>{seconds}s ago</span>
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return <span>{minutes}m ago</span>
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return <span>{hours}h ago</span>
  const days = Math.floor(hours / 24)
  return <span>{days}d ago</span>
}
