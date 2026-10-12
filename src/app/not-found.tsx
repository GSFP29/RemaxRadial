// Fallback de último recurso — fora do segmento [locale], por isso sem
// acesso a traduções nem à cadeia normal do layout público. É este que na
// prática aparece para a maioria dos casos reais (link escrito mal, URL
// antigo) — um caminho totalmente desconhecido nunca chega a resolver um
// valor de [locale], por isso o Next.js nunca entra nesse segmento e cai
// direto aqui. Por isso usa estilo em linha (não classes Tailwind) e
// texto/cores escritos à mão em vez de depender de traduções — tem de
// funcionar sozinho, sem nada à volta. A cena de blobs é a mesma do
// blob-hero.svg (ver src/components/cena-blobs.tsx), só reescrita em SVG
// com estilo em linha pela mesma razão.
import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="pt">
      <body style={{ margin: 0 }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            padding: "0 24px",
            background: "#ffffff",
            overflow: "hidden",
          }}
        >
          <svg
            aria-hidden
            viewBox="0 0 960 540"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
          >
            <g transform="translate(960, 0)">
              <path
                d="M0 320C-48.6 313.8 -97.2 307.6 -132.9 284.4C-168.6 261.2 -191.3 221 -213.6 180.9C-235.9 140.8 -257.8 100.9 -270.9 56.5C-284 12.1 -288.3 -36.8 -297 -85.6L0 -85.6Z"
                fill="#0033a0"
                opacity="0.94"
              />
            </g>
            <g transform="translate(0, 540)">
              <path
                d="M0 -260C42.4 -246.1 84.9 -232.2 121.1 -207.6C157.3 -183 187.2 -147.7 213.9 -110.3C240.6 -72.8 264.1 -33.2 270 12.6C275.9 58.4 264.2 108.4 236.4 141.3C208.6 174.2 164.7 190 121.1 200.4C77.5 210.8 38.8 215.9 0 221L0 0Z"
                fill="#c8102e"
                opacity="0.9"
              />
            </g>
            <g transform="translate(960, 540)">
              <path
                d="M0 -140C-24.8 -128.3 -49.6 -116.6 -68.4 -98.2C-87.2 -79.8 -100 -54.8 -108.9 -27.7C-117.8 -0.6 -122.8 28.6 -113.1 51.9C-103.4 75.2 -79 92.6 -53.1 100.9C-27.2 109.2 0.2 108.4 24.8 99.7C49.4 91 71.2 74.4 87.9 53.3C104.6 32.2 116.2 6.6 116.9 -19.8C117.6 -46.2 107.4 -73.4 88.9 -95.6C70.4 -117.8 43.6 -135 0 -140Z"
                fill="#0033a0"
                opacity="0.14"
              />
            </g>
          </svg>

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-radial.png" alt="RE/MAX Radial" style={{ width: "220px", height: "auto" }} />
            <p style={{ marginTop: "2rem", fontSize: "3.5rem", fontWeight: 700, color: "#0033a0" }}>404</p>
            <h1 style={{ marginTop: "0.5rem", fontSize: "1.5rem", fontWeight: 700, color: "#0b0b0b" }}>
              Página não encontrada
            </h1>
            <p style={{ marginTop: "0.5rem", color: "#52514e", maxWidth: "24rem" }}>
              A página que procura não existe ou foi movida.
            </p>
            <Link
              href="/"
              style={{
                marginTop: "2rem",
                borderRadius: "9999px",
                backgroundColor: "#0033a0",
                color: "#fff",
                padding: "0.75rem 1.75rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
