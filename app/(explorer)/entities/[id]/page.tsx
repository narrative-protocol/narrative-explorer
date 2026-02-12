import { getEntityDetail } from "@/lib/api"
import { EntityDetailContent } from "./entity-detail-content"

export default async function EntityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let data = null
  let error = null
  try {
    data = await getEntityDetail(Number(id))
  } catch (e) {
    error = (e as Error).message
  }

  return <EntityDetailContent data={data} error={error} />
}
