import { searchExplorer } from "@/lib/api"
import { SearchContent } from "./search-content"

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const q = params.q || ""

  let results = null
  let error = null
  if (q.length >= 2) {
    try {
      results = await searchExplorer(q)
    } catch (e) {
      error = (e as Error).message
    }
  }

  return <SearchContent query={q} results={results} error={error} />
}
