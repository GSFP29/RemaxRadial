import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// /imoveis passou a dividir-se em /comprar e /arrendar.
export default async function ImoveisRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/comprar", locale: locale as (typeof routing.locales)[number] });
}
