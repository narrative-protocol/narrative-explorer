import { getDeployments } from "@/lib/api"
import { DeploymentsListContent } from "./deployments-list-content"

export default async function DeploymentsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = Number(params.page) || 1

  let result = null
  let error = null
  try {
    result = await getDeployments(page)
  } catch (e) {
    error = (e as Error).message
  }

  return <DeploymentsListContent result={result} error={error} currentPage={page} />
}
