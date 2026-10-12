import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { listarImoveisPorTipo } from "@/lib/imoveis";

const BASE_URL = "https://radial.remaxradial.workers.dev";

const ROTAS_ESTATICAS = [
  "",
  "/comprar",
  "/arrendar",
  "/vender",
  "/contacto",
  "/juntar-equipa",
  "/privacidade",
  "/termos",
];

function urlLocalizado(rota: string, locale: string) {
  const prefixo = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${BASE_URL}${prefixo}${rota}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entradas: MetadataRoute.Sitemap = [];

  for (const rota of ROTAS_ESTATICAS) {
    for (const locale of routing.locales) {
      entradas.push({
        url: urlLocalizado(rota, locale),
        changeFrequency: rota === "" ? "daily" : "weekly",
        priority: rota === "" ? 1 : 0.7,
      });
    }
  }

  const [paraVenda, paraArrendar] = await Promise.all([
    listarImoveisPorTipo("venda"),
    listarImoveisPorTipo("arrendamento"),
  ]);

  for (const imovel of [...paraVenda, ...paraArrendar]) {
    for (const locale of routing.locales) {
      entradas.push({
        url: urlLocalizado(`/imoveis/${imovel.ref_remax}`, locale),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entradas;
}
