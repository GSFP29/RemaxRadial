import { redirect } from "next/navigation";
import {
  BookOpen,
  BookUser,
  Building2,
  CalendarClock,
  CalendarDays,
  FileText,
  Image,
  Megaphone,
  Search,
  Star,
  TrendingUp,
  Users,
  Waypoints,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ehAdministrador } from "@/lib/consultores";
import { CartaoLink, type CorCartao } from "@/components/ui/cartoes";

const SEPARADORES: {
  nome: string;
  descricao: string;
  href?: string;
  icone: typeof TrendingUp;
  cor: CorCartao;
  soAdmin?: boolean;
}[] = [
  {
    nome: "Desempenho da carteira",
    descricao: "Tempo no mercado e descidas de preço vs. referência histórica",
    href: "/painel/imoveis",
    icone: TrendingUp,
    cor: "azul",
  },
  {
    nome: "Documentos",
    descricao: "Contratos, fichas e checklists — PT e EN",
    href: "/painel/documentos",
    icone: FileText,
    cor: "azul",
  },
  {
    nome: "Templates de Marketing",
    descricao: "Cria imagens para redes sociais em segundos",
    href: "/painel/templates",
    icone: Image,
    cor: "vermelho",
  },
  {
    nome: "Marketing",
    descricao: "Funil de marketing e métricas da estratégia digital",
    href: "/painel/marketing",
    icone: Megaphone,
    cor: "vermelho",
    soAdmin: true,
  },
  {
    nome: "Biblioteca",
    descricao: "Conteúdos educativos escolhidos pela agência",
    href: "/painel/biblioteca",
    icone: BookOpen,
    cor: "azul",
  },
  {
    nome: "Contactos de Parceiros",
    descricao: "Fornecedores por categoria e condições negociadas",
    href: "/painel/parceiros",
    icone: BookUser,
    cor: "azul",
  },
  {
    nome: "Avaliações do Google",
    descricao: "Avaliações mostradas na homepage",
    href: "/painel/avaliacoes",
    icone: Star,
    cor: "vermelho",
    soAdmin: true,
  },
  {
    nome: "O meu calendário",
    descricao: "Visitas, eventos pessoais e escalas",
    href: "/painel/calendario",
    icone: CalendarDays,
    cor: "azul",
  },
  {
    nome: "As minhas leads",
    descricao: "Funil pessoal e próximas ações",
    href: "/painel/leads",
    icone: Users,
    cor: "azul",
  },
  {
    nome: "Salas de reunião",
    descricao: "Sala Paris e Sala Mundo — reserva por horário",
    href: "/painel/salas",
    icone: CalendarClock,
    cor: "azul",
  },
  {
    nome: "Projetos interativos",
    descricao: "Planta com pontos de interesse para mostrar ao cliente",
    href: "/painel/projetos",
    icone: Waypoints,
    cor: "azul",
  },
  { nome: "Os meus imóveis", descricao: "Carteira, estado e dias em carteira", icone: Building2, cor: "neutro" },
  { nome: "Pesquisa de mercado", descricao: "Filtros e mapa por zona", icone: Search, cor: "neutro" },
];

export default async function PainelHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/painel/login");

  const isAdmin = await ehAdministrador(user.id);
  const separadores = SEPARADORES.filter((s) => !s.soAdmin || isAdmin);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Painel</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {separadores.map((s) => (
          <CartaoLink
            key={s.nome}
            href={s.href}
            icone={s.icone}
            titulo={s.nome}
            descricao={s.descricao}
            cor={s.cor}
          />
        ))}
      </div>
    </div>
  );
}
