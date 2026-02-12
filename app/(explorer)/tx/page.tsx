"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Breadcrumbs } from "@/components/explorer-shared"
import { Search } from "lucide-react"

export default function TxLookupPage() {
  const router = useRouter()
  const [chain, setChain] = useState<"solana" | "near">("solana")
  const [hash, setHash] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hash.trim()) {
      router.push(`/tx/${chain}/${encodeURIComponent(hash.trim())}`)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Transaction Lookup" }]} />

      <div>
        <h1 className="text-2xl font-bold text-foreground">Transaction Lookup</h1>
        <p className="mt-1 text-sm text-muted-foreground">Find an event execution by its blockchain transaction signature</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setChain("solana")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              chain === "solana"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Solana
          </button>
          <button
            type="button"
            onClick={() => setChain("near")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              chain === "near"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            NEAR
          </button>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder={chain === "solana" ? "Enter Solana tx signature..." : "Enter NEAR tx hash..."}
              className="h-10 w-full rounded-md border border-border bg-secondary pl-9 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Lookup
          </button>
        </div>
      </form>
    </div>
  )
}
