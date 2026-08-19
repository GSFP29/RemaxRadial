import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchCarteiraRemax, mapListingParaImovel } from "@/lib/remax";

export const dynamic = "force-dynamic";

// Campos cuja alteração vale a pena registar em imoveis_alteracoes.
const CAMPOS_A_VIGIAR = ["estado", "preco_pedido"] as const;

export async function POST(request: Request) {
  const secretEsperado = process.env.INGEST_SECRET;
  const secretRecebido = request.headers.get("authorization")?.replace(
    "Bearer ",
    "",
  );

  if (!secretEsperado || secretRecebido !== secretEsperado) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const inicioDaCorrida = new Date().toISOString();
  const supabase = createAdminClient();

  const [listagens, { data: consultores }] = await Promise.all([
    fetchCarteiraRemax(),
    supabase.from("consultores").select("id, agent_id"),
  ]);

  const consultorIdPorAgentId = new Map(
    (consultores ?? [])
      .filter((c) => c.agent_id)
      .map((c) => [c.agent_id as string, c.id as string]),
  );

  const linhas = listagens.map((l) =>
    mapListingParaImovel(l, consultorIdPorAgentId),
  );

  const refs = linhas.map((l) => l.ref_remax);
  const { data: existentes } = await supabase
    .from("imoveis")
    .select("id, ref_remax, estado, preco_pedido")
    .in("ref_remax", refs);

  const existentePorRef = new Map((existentes ?? []).map((e) => [e.ref_remax, e]));

  const { data: gravados, error: erroUpsert } = await supabase
    .from("imoveis")
    .upsert(linhas, { onConflict: "ref_remax" })
    .select("id, ref_remax");

  if (erroUpsert) {
    return NextResponse.json({ erro: erroUpsert.message }, { status: 500 });
  }

  const idPorRef = new Map((gravados ?? []).map((g) => [g.ref_remax, g.id]));

  const alteracoes = [];
  for (const linha of linhas) {
    const anterior = existentePorRef.get(linha.ref_remax);
    if (!anterior) continue; // imóvel novo, sem histórico a comparar

    for (const campo of CAMPOS_A_VIGIAR) {
      const valorAnterior = anterior[campo];
      const valorNovo = linha[campo as keyof typeof linha];
      if (String(valorAnterior ?? "") !== String(valorNovo ?? "")) {
        alteracoes.push({
          imovel_id: idPorRef.get(linha.ref_remax),
          campo,
          valor_anterior: valorAnterior !== null ? String(valorAnterior) : null,
          valor_novo: valorNovo !== null ? String(valorNovo) : null,
        });
      }
    }
  }

  if (alteracoes.length > 0) {
    await supabase.from("imoveis_alteracoes").insert(alteracoes);
  }

  // Imóveis que já tínhamos e que a API deixou de devolver nesta corrida —
  // provavelmente cancelados (o portal só mostra fechos recentes por algum tempo).
  const { data: desaparecidos } = await supabase
    .from("imoveis")
    .select("id, estado")
    .lt("visto_em", inicioDaCorrida)
    .not("estado", "in", "(vendido,arrendado,desaparecido)");

  if (desaparecidos && desaparecidos.length > 0) {
    await supabase.from("imoveis_alteracoes").insert(
      desaparecidos.map((d) => ({
        imovel_id: d.id,
        campo: "estado",
        valor_anterior: d.estado,
        valor_novo: "desaparecido",
      })),
    );

    await supabase
      .from("imoveis")
      .update({ estado: "desaparecido" })
      .in(
        "id",
        desaparecidos.map((d) => d.id),
      );
  }

  return NextResponse.json({
    imoveis_processados: linhas.length,
    alteracoes_registadas: alteracoes.length,
    marcados_como_desaparecidos: desaparecidos?.length ?? 0,
  });
}
