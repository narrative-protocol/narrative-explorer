/**
 * NEAR AI Cloud verification utilities.
 * @see https://docs.near.ai/cloud/verification/model/
 * @see https://docs.near.ai/cloud/verification/chat/#verify-signature
 */

import { ethers } from "ethers";

const NEAR_AI_ATTESTATION_URL =
  "https://cloud-api.near.ai/v1/attestation/report";

export interface ModelAttestationReport {
  model_attestations: Array<{
    signing_address: string;
    nvidia_payload?: string;
    intel_quote?: string;
  }>;
}

/**
 * Verify chat message signature per NEAR AI Chat Verification.
 * Recovers the signer address from the signature and compares with expected TEE address.
 */
export function verifyChatSignature(
  text: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    console.log(text, signature);
    const recoveredAddress = ethers.verifyMessage(text, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}

/**
 * Generate a random 64-character hex nonce for attestation freshness.
 */
function generateNonce(): string {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 32; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Fetch model attestation report from NEAR AI Cloud.
 * Returns list of verified TEE signing addresses for the model.
 */
export async function fetchModelAttestation(
  model: string,
  signingAlgo = "ecdsa"
): Promise<ModelAttestationReport> {
  const nonce = generateNonce();
  const url = `${NEAR_AI_ATTESTATION_URL}?model=${encodeURIComponent(
    model
  )}&signing_algo=${signingAlgo}&nonce=${nonce}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Attestation API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Verify that the signing address is from a trusted NEAR AI TEE.
 * Fetches the model attestation report and checks if the address is in the list.
 */
export async function verifyModelAttestation(
  signingAddress: string,
  model: string,
  signingAlgo = "ecdsa"
): Promise<{
  verified: boolean;
  addresses: string[];
  error?: string;
}> {
  try {
    const report = await fetchModelAttestation(model, signingAlgo);
    const addresses = report.model_attestations.map((a) =>
      a.signing_address.toLowerCase()
    );
    const normalized = signingAddress.toLowerCase();
    const verified = addresses.includes(normalized);
    return {
      verified,
      addresses: report.model_attestations.map((a) => a.signing_address),
    };
  } catch (err) {
    return {
      verified: false,
      addresses: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
