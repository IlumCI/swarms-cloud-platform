export type SnippetLanguage = 'curl' | 'python' | 'typescript' | 'go' | 'json';

export const SNIPPET_LANGUAGES: {
  id: SnippetLanguage;
  label: string;
  ext: string;
}[] = [
  { id: 'curl', label: 'cURL', ext: 'sh' },
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts' },
  { id: 'go', label: 'Go', ext: 'go' },
  { id: 'json', label: 'JSON', ext: 'json' },
];

/**
 * Strip top-level keys whose value is null/undefined/'' so generated snippets
 * don't show empty fields to the user.
 */
function pruneEmpty<T>(payload: T): T {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload)) {
    return payload.map((item) => pruneEmpty(item)) as unknown as T;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = pruneEmpty(value as unknown);
  }
  return out as T;
}

function jsonIndent(value: unknown, indent = 2): string {
  return JSON.stringify(pruneEmpty(value), null, indent);
}

/** Shell-escape a single-quoted segment. */
function shellSingleQuote(s: string): string {
  return s.replace(/'/g, `'\\''`);
}

export function buildCurl(opts: {
  baseUrl: string;
  endpoint: string;
  method?: 'POST' | 'GET';
  payload?: unknown;
}): string {
  const method = opts.method ?? 'POST';
  const url = `${opts.baseUrl}${opts.endpoint}`;
  const lines: string[] = [
    `curl -X ${method} '${url}' \\`,
    `  -H 'x-api-key: '"$SWARMS_API_KEY"`,
  ];
  if (method !== 'GET' && opts.payload !== undefined) {
    lines[lines.length - 1] += ' \\';
    lines.push(`  -H 'Content-Type: application/json' \\`);
    const body = jsonIndent(opts.payload, 2);
    lines.push(`  -d '${shellSingleQuote(body)}'`);
  }
  return lines.join('\n');
}

export function buildPython(opts: {
  baseUrl: string;
  endpoint: string;
  method?: 'POST' | 'GET';
  payload?: unknown;
}): string {
  const method = opts.method ?? 'POST';
  const url = `${opts.baseUrl}${opts.endpoint}`;
  if (method === 'GET') {
    return [
      `import os`,
      `import requests`,
      ``,
      `response = requests.get(`,
      `    "${url}",`,
      `    headers={"x-api-key": os.environ["SWARMS_API_KEY"]},`,
      `)`,
      `response.raise_for_status()`,
      `print(response.json())`,
    ].join('\n');
  }
  const body = jsonIndent(opts.payload, 4);
  return [
    `import os`,
    `import requests`,
    ``,
    `payload = ${body}`,
    ``,
    `response = requests.post(`,
    `    "${url}",`,
    `    headers={`,
    `        "x-api-key": os.environ["SWARMS_API_KEY"],`,
    `        "Content-Type": "application/json",`,
    `    },`,
    `    json=payload,`,
    `)`,
    `response.raise_for_status()`,
    `print(response.json())`,
  ].join('\n');
}

export function buildTypeScript(opts: {
  baseUrl: string;
  endpoint: string;
  method?: 'POST' | 'GET';
  payload?: unknown;
}): string {
  const method = opts.method ?? 'POST';
  const url = `${opts.baseUrl}${opts.endpoint}`;
  if (method === 'GET') {
    return [
      `const response = await fetch("${url}", {`,
      `  headers: { "x-api-key": process.env.SWARMS_API_KEY! },`,
      `});`,
      `if (!response.ok) throw new Error(\`HTTP \${response.status}\`);`,
      `const data = await response.json();`,
      `console.log(data);`,
    ].join('\n');
  }
  const body = jsonIndent(opts.payload, 2);
  return [
    `const payload = ${body};`,
    ``,
    `const response = await fetch("${url}", {`,
    `  method: "POST",`,
    `  headers: {`,
    `    "x-api-key": process.env.SWARMS_API_KEY!,`,
    `    "Content-Type": "application/json",`,
    `  },`,
    `  body: JSON.stringify(payload),`,
    `});`,
    ``,
    `if (!response.ok) throw new Error(\`HTTP \${response.status}\`);`,
    `const data = await response.json();`,
    `console.log(data);`,
  ].join('\n');
}

export function buildGo(opts: {
  baseUrl: string;
  endpoint: string;
  method?: 'POST' | 'GET';
  payload?: unknown;
}): string {
  const method = opts.method ?? 'POST';
  const url = `${opts.baseUrl}${opts.endpoint}`;
  if (method === 'GET') {
    return [
      `package main`,
      ``,
      `import (`,
      `\t"fmt"`,
      `\t"io"`,
      `\t"net/http"`,
      `\t"os"`,
      `)`,
      ``,
      `func main() {`,
      `\treq, _ := http.NewRequest("GET", "${url}", nil)`,
      `\treq.Header.Set("x-api-key", os.Getenv("SWARMS_API_KEY"))`,
      ``,
      `\tres, err := http.DefaultClient.Do(req)`,
      `\tif err != nil { panic(err) }`,
      `\tdefer res.Body.Close()`,
      ``,
      `\tbody, _ := io.ReadAll(res.Body)`,
      `\tfmt.Println(string(body))`,
      `}`,
    ].join('\n');
  }
  return [
    `package main`,
    ``,
    `import (`,
    `\t"bytes"`,
    `\t"fmt"`,
    `\t"io"`,
    `\t"net/http"`,
    `\t"os"`,
    `)`,
    ``,
    `func main() {`,
    `\tpayload := []byte(\`${jsonIndent(opts.payload, 2)}\`)`,
    ``,
    `\treq, _ := http.NewRequest("POST", "${url}", bytes.NewBuffer(payload))`,
    `\treq.Header.Set("x-api-key", os.Getenv("SWARMS_API_KEY"))`,
    `\treq.Header.Set("Content-Type", "application/json")`,
    ``,
    `\tres, err := http.DefaultClient.Do(req)`,
    `\tif err != nil { panic(err) }`,
    `\tdefer res.Body.Close()`,
    ``,
    `\tbody, _ := io.ReadAll(res.Body)`,
    `\tfmt.Println(string(body))`,
    `}`,
  ].join('\n');
}

export function buildJson(payload: unknown): string {
  return jsonIndent(payload, 2);
}

export function buildSnippet(
  language: SnippetLanguage,
  opts: {
    baseUrl: string;
    endpoint: string;
    method?: 'POST' | 'GET';
    payload?: unknown;
  }
): string {
  switch (language) {
    case 'curl':
      return buildCurl(opts);
    case 'python':
      return buildPython(opts);
    case 'typescript':
      return buildTypeScript(opts);
    case 'go':
      return buildGo(opts);
    case 'json':
      return buildJson(opts.payload ?? {});
    default: {
      const _exhaustive: never = language;
      throw new Error(`Unsupported language: ${_exhaustive}`);
    }
  }
}
