import { lookupNearTx } from "@/lib/api"
import { TxResultContent } from "../../tx-result-content"

export default async function NearTxPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params

  let data = null
  let error = null
  try {
    data = await lookupNearTx(hash)
  } catch (e) {
    error = (e as Error).message
  }

  return <TxResultContent data={data} error={error} chain="near" hash={hash} />
}
