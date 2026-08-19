import type { ImovelPublico } from "@/lib/imoveis";

export function LocalizacaoImovel({ imovel }: { imovel: ImovelPublico }) {
  // `morada` (quando existe) já vem com freguesia e concelho incluídos —
  // só juntar os dois à parte quando não há morada de rua disponível.
  const morada =
    imovel.morada ??
    [imovel.freguesia, imovel.concelho].filter(Boolean).join(", ");

  if (imovel.latitude === null || imovel.longitude === null) {
    return morada ? (
      <p className="mt-4 text-foreground-secondary">{morada}</p>
    ) : null;
  }

  const coordenadas = `${imovel.latitude},${imovel.longitude}`;
  const linkGoogleMaps = `https://www.google.com/maps/search/?api=1&query=${coordenadas}`;
  const embedGoogleMaps = `https://www.google.com/maps?q=${coordenadas}&z=16&output=embed`;

  return (
    <div className="mt-6">
      <div className="overflow-hidden rounded-lg border border-grid">
        <iframe
          title="Localização do imóvel"
          src={embedGoogleMaps}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-video w-full"
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        {morada && <p className="text-foreground-secondary">{morada}</p>}
        <a
          href={linkGoogleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-brand-blue"
        >
          Abrir no Google Maps →
        </a>
      </div>
    </div>
  );
}
