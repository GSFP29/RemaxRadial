// Mesma lógica da Política de Privacidade: conteúdo legal sempre em
// português (decisão do cliente, 31 Ago 2026), sem nomear fornecedores
// técnicos, com cláusulas de salvaguarda para a agência.
const TITULO = "Termos de Uso";
const ATUALIZADO = "Última atualização: 31 de agosto de 2026";
const INTRO =
  "Estes termos regulam a utilização deste site pela RE/MAX Radial. Ao aceder e utilizar este site, aceita os termos aqui descritos.";

const SECCOES = [
  {
    heading: "Objeto do site",
    body: "Este site tem carácter informativo: apresenta a agência RE/MAX Radial, imóveis disponíveis para compra e arrendamento, e formulários de contacto. Não é uma plataforma de transação — nenhuma compra, venda ou arrendamento se conclui diretamente através deste site.",
  },
  {
    heading: "Uso permitido",
    body: "Pode consultar e utilizar este site para fins pessoais e legítimos relacionados com a procura ou promoção de imóveis. É proibido usar este site para fins ilegais, recolher dados de forma automatizada (scraping), sobrecarregar deliberadamente os nossos sistemas, ou tentar aceder a áreas restritas sem autorização.",
  },
  {
    heading: "Informação sobre imóveis",
    body: "Os preços, características e disponibilidade dos imóveis apresentados estão sujeitos a alteração sem aviso prévio e podem já não corresponder à situação atual no momento da consulta. A informação é fornecida com base nos dados disponíveis na rede RE/MAX e não constitui uma proposta contratual — confirme sempre os detalhes junto do consultor responsável antes de tomar qualquer decisão.",
  },
  {
    heading: "Propriedade intelectual",
    body: "O conteúdo deste site (textos, imagens próprias, design, logótipo) pertence à RE/MAX Radial ou é usado sob licença, incluindo a marca e identidade visual RE/MAX. Não pode ser copiado, reproduzido ou reutilizado sem autorização prévia por escrito.",
  },
  {
    heading: "Limitação de responsabilidade",
    body: "Este site é disponibilizado tal como está, sem garantias de disponibilidade permanente, ausência de erros ou adequação a um fim específico. A RE/MAX Radial não se responsabiliza por danos resultantes do uso ou da impossibilidade de uso deste site, nem por decisões tomadas com base na informação nele contida.",
  },
  {
    heading: "Ligações a sites de terceiros",
    body: "Este site contém ligações para sites de terceiros (por exemplo, o portal oficial da RE/MAX, a MaxFinance Delta, ou o WhatsApp). Não somos responsáveis pelo conteúdo, funcionamento ou práticas desses sites.",
  },
  {
    heading: "Alterações a estes termos",
    body: "Podemos atualizar estes termos a qualquer momento, sem aviso prévio. A data no topo desta página indica a última atualização — a utilização continuada do site após uma alteração implica a aceitação da versão atualizada.",
  },
  {
    heading: "Lei aplicável",
    body: "Estes termos regem-se pela lei portuguesa. Para a resolução de qualquer litígio, é competente o tribunal da comarca de Lisboa, com exclusão de qualquer outro.",
  },
];

export default function TermosPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">{TITULO}</h1>
      <p className="mt-1 text-sm text-foreground-secondary">{ATUALIZADO}</p>
      <p className="mt-6 text-foreground-secondary">{INTRO}</p>

      <div className="mt-10 flex flex-col gap-8">
        {SECCOES.map((seccao) => (
          <div key={seccao.heading}>
            <h2 className="text-lg font-semibold">{seccao.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              {seccao.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
