export type Hotspot = {
  id: string;
  x: number; // percentagem 0–100 da largura da imagem
  y: number; // percentagem 0–100 da altura da imagem
  titulo: string;
  texto?: string;
};

export type ProjetoInterativo = {
  id: string;
  titulo: string;
  imagem_path: string;
  hotspots: Hotspot[];
  consultor_id: string;
  criado_em: string;
};

export function urlImagemProjeto(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/plantas-projetos/${path}`;
}
