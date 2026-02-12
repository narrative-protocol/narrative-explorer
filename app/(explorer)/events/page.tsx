import { getGlobalEvents } from "@/lib/api"
import { EventsListContent } from "./events-list-content"

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = Number(params.page) || 1

  let result = null
  let error = null
  try {
    result = await getGlobalEvents(page)
  } catch (e) {
    error = (e as Error).message
  }

  return <EventsListContent result={result} error={error} currentPage={page} />
}
