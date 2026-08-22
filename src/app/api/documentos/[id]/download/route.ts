import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const BUCKET = "documentos-consultor";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { data: documento } = await admin
    .from("documentos_consultor")
    .select("caminho_storage, nome, extensao")
    .eq("id", id)
    .maybeSingle();

  if (!documento) {
    return NextResponse.json({ erro: "documento não encontrado" }, { status: 404 });
  }

  const { data: assinado, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(documento.caminho_storage, 60, {
      download: `${documento.nome}.${documento.extensao}`,
    });

  if (error || !assinado) {
    return NextResponse.json({ erro: "falha ao gerar link" }, { status: 500 });
  }

  return NextResponse.redirect(assinado.signedUrl);
}
