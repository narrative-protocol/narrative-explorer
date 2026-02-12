import { getEventDetail } from "@/lib/api"
import { EventDetailContent } from "./event-detail-content"

export default async function EventDetailPage({ params }: { params: Promise<{ historyId: string }> }) {
  const { historyId } = await params

  let data = null
  let error = null
  try {
    data = await getEventDetail(Number(historyId))
  } catch (e) {
    error = (e as Error).message
  }

  return <EventDetailContent data={data} error={error} />
}
