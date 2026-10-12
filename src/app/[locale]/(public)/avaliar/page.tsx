import { notFound } from "next/navigation";

// Retirado do site (26 Ago 2026) a pedido do cliente — não quer expor
// valores de imóveis a clientes desta forma. Todo o código por baixo
// (esta página, formulario-avaliacao.tsx, actions.ts, lib/avaliacao.ts,
// lib/ine.ts, lib/referencias-maxwork.ts, migrations 0017/0018) fica
// intacto para o caso de o simulador ser reestruturado mais tarde — só
// esta rota deixa de responder.
export default function AvaliarPage() {
  notFound();
}
