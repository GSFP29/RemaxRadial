import {
  BookOpen,
  BookUser,
  CalendarClock,
  CalendarDays,
  FileText,
  Image,
  LayoutDashboard,
  Megaphone,
  Star,
  TrendingUp,
  Users,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

export type ItemNavPainel = {
  nome: string;
  descricao: string;
  href: string;
  icone: LucideIcon;
  soAdmin?: boolean;
};

// Fonte única para a navegação do painel — usada pela sidebar e pelos
// cartões da página inicial. Só entram aqui páginas que já existem;
// funcionalidades planeadas ficam de fora até estarem construídas.
export const NAV_PAINEL: ItemNavPainel[] = [
  {
    nome: "Painel",
    descricao: "Visão geral",
    href: "/painel",
    icone: LayoutDashboard,
  },
  {
    nome: "Desempenho da carteira",
    descricao: "Tempo no mercado e descidas de preço vs. referência histórica",
    href: "/painel/imoveis",
    icone: TrendingUp,
  },
  {
    nome: "Documentos",
    descricao: "Contratos, fichas e checklists — PT e EN",
    href: "/painel/documentos",
    icone: FileText,
  },
  {
    nome: "Biblioteca",
    descricao: "Conteúdos educativos escolhidos pela agência",
    href: "/painel/biblioteca",
    icone: BookOpen,
  },
  {
    nome: "Contactos de Parceiros",
    descricao: "Fornecedores por categoria e condições negociadas",
    href: "/painel/parceiros",
    icone: BookUser,
  },
  {
    nome: "O meu calendário",
    descricao: "Visitas, eventos pessoais e escalas",
    href: "/painel/calendario",
    icone: CalendarDays,
  },
  {
    nome: "As minhas leads",
    descricao: "Funil pessoal e próximas ações",
    href: "/painel/leads",
    icone: Users,
  },
  {
    nome: "Salas de reunião",
    descricao: "Sala Paris e Sala Mundo — reserva por horário",
    href: "/painel/salas",
    icone: CalendarClock,
  },
  {
    nome: "Projetos interativos",
    descricao: "Planta com pontos de interesse para mostrar ao cliente",
    href: "/painel/projetos",
    icone: Waypoints,
  },
  {
    nome: "Templates de Marketing",
    descricao: "Cria imagens para redes sociais em segundos",
    href: "/painel/templates",
    icone: Image,
  },
  {
    nome: "Marketing",
    descricao: "Funil de marketing e métricas da estratégia digital",
    href: "/painel/marketing",
    icone: Megaphone,
    soAdmin: true,
  },
  {
    nome: "Avaliações do Google",
    descricao: "Avaliações mostradas na homepage",
    href: "/painel/avaliacoes",
    icone: Star,
    soAdmin: true,
  },
];
