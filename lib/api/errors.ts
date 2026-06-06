import { NextResponse } from 'next/server';

/**
 * Map of HTTP status codes to user-safe messages. Anything not in this map
 * gets the generic 500 message. The point is to never echo an upstream error
 * body, hostname, query fragment, or stack trace back to the browser.
 */
const SAFE_MESSAGE_BY_STATUS: Record<number, string> = {
  400: 'Bad request.',
  401: 'You are not signed in or your session has expired.',
  402: 'Your Swarms account does not have enough credits to run this.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  408: 'The request took too long. Please try again.',
  409: 'The request conflicted with the current state. Please retry.',
  413: 'The request payload is too large.',
  415: 'Unsupported request format.',
  422: 'The request could not be processed as written.',
  429: 'Rate limit exceeded. Slow down and try again shortly.',
  500: 'Something went wrong on our side. Please try again shortly.',
  502: 'Upstream service is unavailable. Please try again shortly.',
  503: 'Service temporarily unavailable. Please try again shortly.',
  504: 'Upstream service timed out. Please try again shortly.',
};

interface PossiblyHasStatus {
  status?: number;
  code?: string | number;
  message?: string;
}

function pickStatus(error: unknown): number {
  const e = error as PossiblyHasStatus;
  const raw = e?.status;
  if (typeof raw === 'number' && raw >= 400 && raw < 600) return raw;
  return 500;
}

/**
 * Convert any error thrown inside an API route into a sanitised JSON response.
 * The full error is logged server-side under the supplied `context` for
 * debugging; the client only sees the status-code-mapped safe message and an
 * opaque code, if the upstream provided one.
 */
export function jsonErrorFromUnknown(
  context: string,
  error: unknown,
): NextResponse {
  // Log the full error server-side. This is the only place the raw upstream
  // detail should ever live.
  console.error(`[${context}]`, error);

  const status = pickStatus(error);
  const safeMessage =
    SAFE_MESSAGE_BY_STATUS[status] ?? SAFE_MESSAGE_BY_STATUS[500];

  const e = error as PossiblyHasStatus;
  const code = typeof e?.code === 'string' ? e.code : undefined;

  return NextResponse.json(
    code ? { error: safeMessage, code } : { error: safeMessage },
    { status },
  );
}
