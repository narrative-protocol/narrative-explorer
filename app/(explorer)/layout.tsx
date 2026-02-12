import { ExplorerHeader } from "@/components/explorer-header"

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <ExplorerHeader />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>Narrative Protocol Explorer - Verifiable LLM Game Engine</p>
      </footer>
    </div>
  )
}
