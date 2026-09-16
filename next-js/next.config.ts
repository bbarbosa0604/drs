import type { NextConfig } from "next";

/**
 * Headers HTTP de seguranca (norma do scaffold, ver `docs/ai/SECURITY.md § Headers De
 * Seguranca Http`). Aplicados a toda rota desde o primeiro commit do projeto — nao um
 * ajuste para adicionar depois. Se o projeto instalar Payload via `criar-cms-payload`,
 * a skill preserva este `headers()` ao envolver o config com `withPayload(...)`, nunca
 * substitui por um config novo sem ele.
 *
 * `'unsafe-eval'` entra em `script-src` **so em desenvolvimento**: o React em modo dev
 * usa `eval()` para reconstruir stack trace e outros recursos de debug ("React will
 * never use eval() in production mode" — mensagem do proprio React). Sem isso, `next
 * dev` (Turbopack) quebra com "eval() is not supported". Producao nunca ganha
 * `'unsafe-eval'`.
 */
const isDev = process.env.NODE_ENV !== "production";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
