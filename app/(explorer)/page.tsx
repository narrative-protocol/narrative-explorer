import { getGlobalStats } from "@/lib/api"
import { HomeContent } from "./home-content"

export default async function HomePage() {
  let data = null
  let error = null
  try {
    data = await getGlobalStats()
  } catch (e) {
    error = (e as Error).message
  }

  return <HomeContent data={data} error={error} />
}
