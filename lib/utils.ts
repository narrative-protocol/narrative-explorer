import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Truncate address in the center, keeping head & tail (e.g. "0x1234...abcd") */
export function truncateAddress(address: string, head = 10, tail = 8): string {
  if (!address || address.length <= head + tail) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}
