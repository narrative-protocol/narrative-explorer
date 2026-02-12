"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Breadcrumbs,
  ChainBadge,
  ExternalTxLink,
  JsonBlock,
} from "@/components/explorer-shared";
import {
  ShieldCheck,
  FileCode2,
  ArrowRightLeft,
  CheckCircle2,
  Link2,
  Cpu,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  verifyChatSignature,
  verifyModelAttestation,
} from "@/lib/verification";
import type { EventDetail } from "@/lib/api";

function VerificationStatus({
  label,
  status,
  detail,
}: {
  label: string;
  status: "pending" | "loading" | "pass" | "fail";
  detail?: string;
}) {
  const icons = {
    pending: null,
    loading: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
    pass: <CheckCircle className="h-4 w-4 text-green-500" />,
    fail: <XCircle className="h-4 w-4 text-destructive" />,
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {icons[status]}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {detail && <p className="text-xs text-muted-foreground pl-6">{detail}</p>}
    </div>
  );
}

export function EventDetailContent({
  data,
  error,
}: {
  data: EventDetail | null;
  error: string | null;
}) {
  const [sigVerified, setSigVerified] = useState<boolean | null>(null);
  const [modelVerifyState, setModelVerifyState] = useState<
    "idle" | "loading" | "pass" | "fail"
  >("idle");
  const [modelVerifyDetail, setModelVerifyDetail] = useState<string>("");

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Events", href: "/events" },
            { label: "Error" },
          ]}
        />
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error || "Event not found"}
        </div>
      </div>
    );
  }

  // Run signature verification on mount when attestation exists
  useEffect(() => {
    if (!data.attestation) return;
    const ok = verifyChatSignature(
      data.attestation.text,
      data.attestation.signature,
      data.attestation.signingAddress
    );
    setSigVerified(ok);
  }, [data.attestation]);

  const runModelVerification = async () => {
    if (!data.attestation || !data.llm?.model) return;
    setModelVerifyState("loading");
    setModelVerifyDetail("");
    try {
      const result = await verifyModelAttestation(
        data.attestation.signingAddress,
        data.llm.model,
        data.attestation.signingAlgo
      );
      if (result.error) {
        setModelVerifyState("fail");
        setModelVerifyDetail(result.error);
      } else if (result.verified) {
        setModelVerifyState("pass");
        setModelVerifyDetail(
          `Signing address verified against NEAR AI model attestation report.`
        );
      } else {
        setModelVerifyState("fail");
        setModelVerifyDetail(
          `Signing address not found in verified TEE list (${result.addresses.length} addresses in report).`
        );
      }
    } catch (err) {
      setModelVerifyState("fail");
      setModelVerifyDetail(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: `#${data.id} ${data.event.name}` },
        ]}
      />

      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <FileCode2 className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold font-mono text-foreground">
                {data.event.name}
              </h1>
            </div>
            {data.event.description && (
              <p className="text-sm text-muted-foreground">
                {data.event.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Link
                href={`/worlds/${data.deployment.world.id}`}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Link2 className="h-3 w-3" /> {data.deployment.world.name}
              </Link>
              <span className="text-border">|</span>
              <Link
                href={`/deployments/${data.deployment.id}`}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Link2 className="h-3 w-3" /> {data.deployment.name}
              </Link>
              <span className="text-border">|</span>
              <ChainBadge chain={data.deployment.targetChain} />
            </div>
          </div>
          <div className="text-right text-sm">
            <div>
              <span className="text-xs text-muted-foreground">
                Event Version
              </span>
              <p className="font-mono text-foreground">
                v{data.eventVersion.version}
              </p>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Executed At</span>
              <p className="font-mono text-foreground">
                {new Date(data.execution.executedAt).toLocaleString()}
              </p>
            </div>
            {data.execution.executedBy && (
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">
                  Executed By
                </span>
                <p className="font-mono text-foreground">
                  #{data.execution.executedBy}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Version Schemas */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <FileCode2 className="h-4 w-4" /> Schemas
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">
              Input Schema
            </h3>
            <JsonBlock data={data.eventVersion.inputSchema} />
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">
              Result Schema
            </h3>
            <JsonBlock data={data.eventVersion.resultSchema} />
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">
              State Change Schema
            </h3>
            <JsonBlock data={data.eventVersion.stateChangeSchema} />
          </div>
        </div>
      </section>

      {/* Execution Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <ArrowRightLeft className="h-4 w-4" /> Input
          </h2>
          <JsonBlock data={data.execution.input} />
        </section>
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" /> Result
          </h2>
          <JsonBlock data={data.execution.result} />
        </section>
      </div>

      {/* State Changes */}
      {data.execution.stateChanges &&
        Object.keys(data.execution.stateChanges).length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <ArrowRightLeft className="h-4 w-4" /> State Changes
            </h2>
            <JsonBlock data={data.execution.stateChanges} />
          </section>
        )}

      {/* LLM Section */}
      {data.llm && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Cpu className="h-4 w-4" /> LLM Inference
          </h2>
          <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            <div>
              <span className="text-xs text-muted-foreground">Model</span>
              <p className="font-mono text-sm text-foreground">
                {data.llm.model}
              </p>
            </div>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:underline [&[data-state=open]>svg]:rotate-90">
                <ChevronRight className="h-4 w-4 transition-transform" />
                Request (prompt)
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-secondary p-3 text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                  {data.llm.request}
                </pre>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:underline [&[data-state=open]>svg]:rotate-90">
                <ChevronRight className="h-4 w-4 transition-transform" />
                Response
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-secondary p-3 text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                  {data.llm.response}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>
      )}

      {/* Attestation & Verification */}
      {data.attestation && (
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
            <ShieldCheck className="h-5 w-5" /> Attestation & Verification
          </h2>
          <div className="space-y-6">
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-xs text-muted-foreground">
                  Signing Algorithm
                </span>
                <p className="font-mono text-foreground">
                  {data.attestation.signingAlgo}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Signing Address (TEE)
                </span>
                <p className="break-all font-mono text-foreground">
                  {data.attestation.signingAddress}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-muted-foreground">
                  Signed Text (request_hash:response_hash)
                </span>
                <p className="break-all font-mono text-xs text-foreground mt-0.5">
                  {data.attestation.text}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs text-muted-foreground">Signature</span>
                <p className="break-all font-mono text-xs text-foreground mt-0.5">
                  {data.attestation.signature}
                </p>
              </div>
            </div>

            <div className="rounded-md border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Verification Results
              </h3>
              <div className="space-y-4">
                <VerificationStatus
                  label="Signature verification"
                  status={
                    sigVerified === null
                      ? "pending"
                      : sigVerified
                      ? "pass"
                      : "fail"
                  }
                  detail={
                    sigVerified === null
                      ? undefined
                      : sigVerified
                      ? "ECDSA signature valid; recovered address matches TEE signing address."
                      : "Signature verification failed."
                  }
                />
                {data.llm?.model && (
                  <div>
                    <VerificationStatus
                      label="Model attestation (NEAR AI TEE)"
                      status={
                        modelVerifyState === "idle"
                          ? "pending"
                          : modelVerifyState === "loading"
                          ? "loading"
                          : modelVerifyState === "pass"
                          ? "pass"
                          : "fail"
                      }
                      detail={
                        modelVerifyState === "idle"
                          ? "Verify that the TEE is a trusted NEAR AI node."
                          : modelVerifyDetail
                      }
                    />
                    {modelVerifyState === "idle" && (
                      <button
                        onClick={runModelVerification}
                        className="mt-2 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                      >
                        Verify against NEAR AI attestation report
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              <a
                href="https://docs.near.ai/cloud/verification/model/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Model Verification <ExternalLink className="h-3 w-3" />
              </a>
              {" · "}
              <a
                href="https://docs.near.ai/cloud/verification/chat/#verify-signature"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Chat Signature Verification <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </section>
      )}

      {/* On-Chain Records */}
      {(data.onChain.solana || data.onChain.near) && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            On-Chain Records
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.onChain.solana && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">Solana</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Transaction
                    </span>
                    <div className="mt-0.5">
                      <ExternalTxLink
                        url={data.onChain.solana.explorerUrl}
                        label={
                          data.onChain.solana.signature.slice(0, 16) + "..."
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Event Record PDA
                    </span>
                    <p className="break-all font-mono text-xs text-foreground">
                      {data.onChain.solana.eventRecordPda}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {data.onChain.near && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 font-semibold text-foreground">NEAR</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Transaction Hash
                    </span>
                    <div className="mt-0.5">
                      <ExternalTxLink
                        url={data.onChain.near.explorerUrl}
                        label={data.onChain.near.txHash.slice(0, 20) + "..."}
                      />
                    </div>
                    <p className="break-all font-mono text-xs text-muted-foreground mt-0.5">
                      {data.onChain.near.txHash}
                    </p>
                  </div>
                  {data.onChain.near.receiptId && (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Receipt ID
                      </span>
                      <p className="break-all font-mono text-xs text-foreground">
                        {data.onChain.near.receiptId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
