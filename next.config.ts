import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Domínios externos legítimos do site — ver docs/decisoes.md se a lista
// mudar. i.maxwork.pt (fotos dos imóveis), Supabase (base de dados +
// storage de plantas/documentos), Google Maps (mapa embutido na ficha do
// imóvel).
const SUPABASE_HOST = "https://ytvvdsfacnewrbjglhww.supabase.co";

// 'unsafe-eval' só em desenvolvimento — o Fast Refresh do Next.js precisa,
// a build de produção não.
const scriptSrc = ["'self'", "'unsafe-inline'"];
if (process.env.NODE_ENV !== "production") scriptSrc.push("'unsafe-eval'");

const CSP = [
  `default-src 'self'`,
  `script-src ${scriptSrc.join(" ")}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: https://i.maxwork.pt ${SUPABASE_HOST}`,
  `font-src 'self' data:`,
  `connect-src 'self' ${SUPABASE_HOST}`,
  `frame-src https://www.google.com`,
  `frame-ancestors 'self'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default withNextIntl(nextConfig);

// Habilita bindings do Cloudflare (Supabase env vars, etc.) durante `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
