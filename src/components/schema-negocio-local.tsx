import { AGENCIA } from "@/lib/agencia";

const BASE_URL = "https://radial.remaxradial.workers.dev";

export function SchemaNegocioLocal() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "RE/MAX Radial",
    image: `${BASE_URL}/og-image.png`,
    url: BASE_URL,
    telephone: AGENCIA.telefone ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. 25 de Abril, 22A",
      addressLocality: "Ramada",
      postalCode: "2620-186",
      addressCountry: "PT",
    },
    areaServed: "Odivelas",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
