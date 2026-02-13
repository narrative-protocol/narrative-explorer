import { ExplorerHeader } from "@/components/explorer-header";
import Link from "next/link";

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <ExplorerHeader />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div>
          <Link
            className="text-primary hover:underline"
            href="https://narrativeprotocol.com"
            target="_blank"
          >
            Narrative Protocol
          </Link>
          <span className="text-muted-foreground">
            {` - AI-Powered World State & Event Engine`}
          </span>
        </div>
      </footer>
    </div>
  );
}
