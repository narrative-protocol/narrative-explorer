import { getWorldDetail } from "@/lib/api"
import { WorldDetailContent } from "./world-detail-content"

export default async function WorldDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let data = null
  let error = null
  try {
    data = await getWorldDetail(Number(id))
  } catch (e) {
    error = (e as Error).message
  }

  return <WorldDetailContent data={data} error={error} />
}
