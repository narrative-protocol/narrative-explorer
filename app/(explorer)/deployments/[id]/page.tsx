import { getDeploymentDetail, getDeploymentEntities, getDeploymentHistory } from "@/lib/api"
import { DeploymentDetailContent } from "./deployment-detail-content"

export default async function DeploymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numId = Number(id)

  let data = null
  let entities = null
  let history = null
  let error = null

  try {
    const [d, e, h] = await Promise.all([
      getDeploymentDetail(numId),
      getDeploymentEntities(numId).catch(() => null),
      getDeploymentHistory(numId).catch(() => null),
    ])
    data = d
    entities = e
    history = h
  } catch (e) {
    error = (e as Error).message
  }

  return <DeploymentDetailContent data={data} entities={entities} history={history} error={error} />
}
