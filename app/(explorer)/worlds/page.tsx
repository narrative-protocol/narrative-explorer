import { getWorlds } from "@/lib/api"
import { WorldsListContent } from "./worlds-list-content"

export default async function WorldsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = Number(params.page) || 1

  let result = null
  let error = null
  try {
    result = await getWorlds(page)
  } catch (e) {
    error = (e as Error).message
  }

  return <WorldsListContent result={result} error={error} currentPage={page} />
}
