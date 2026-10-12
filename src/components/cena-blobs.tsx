// Mesma cena do hero da homepage (public/blob-hero.svg), mas embutida como
// SVG em vez de imagem de fundo — com preserveAspectRatio="none" para
// esticar sempre até às 4 margens da secção, seja qual for a proporção do
// ecrã. Numa secção mais baixa e larga (como Contacto/Vender), um
// background-image com "cover" cortava as bolhas a meio; assim tocam
// sempre nos cantos, tal como no hero.
export function CenaBlobs() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 960 540"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
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
  );
}
