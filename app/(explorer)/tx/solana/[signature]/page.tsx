import { lookupSolanaTx } from "@/lib/api"
import { TxResultContent } from "../../tx-result-content"

export default async function SolanaTxPage({ params }: { params: Promise<{ signature: string }> }) {
  const { signature } = await params

  let data = null
  let error = null
  try {
    data = await lookupSolanaTx(signature)
  } catch (e) {
    error = (e as Error).message
  }

  return <TxResultContent data={data} error={error} chain="solana" hash={signature} />
}
