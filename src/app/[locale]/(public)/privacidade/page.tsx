// Conteúdo legal sempre em português, seja qual for a língua do site —
// decisão explícita do cliente (31 Ago 2026): não vale a pena arriscar uma
// tradução imprecisa de um documento legal (não há obrigação legal de o
// traduzir, o RGPD só exige "linguagem clara e acessível", não uma língua
// específica). O rótulo do link no rodapé continua traduzido, só o
// conteúdo desta página fica fixo em PT.
//
// Não nomeia fornecedores técnicos específicos (pedido explícito do
// cliente, 31 Ago 2026) — fala em "prestadores de serviços tecnológicos"
// em genérico. Inclui cláusulas de salvaguarda para a agência (exatidão
// da informação prestada, limitação de responsabilidade, ligações a
// terceiros, uso indevido) — também pedido explícito dele.
const TITULO = "Política de Privacidade";
const ATUALIZADO = "Última atualização: 31 de agosto de 2026";
const INTRO =
  "Esta política explica que dados pessoais a RE/MAX Radial recolhe através deste site, para quê, e quais são os seus direitos. Ao usar este site e submeter qualquer formulário, aceita os termos aqui descritos.";

const SECCOES = [
  {
    heading: "Quem é o responsável pelo tratamento",
    body: "RE/MAX Radial, agência 12116, com morada em Av. 25 de Abril, Odivelas. Pode contactar-nos através do formulário de contacto deste site ou pelo telefone +351 219 349 100.",
  },
  {
    heading: "Que dados recolhemos e para quê",
    body: "Só recolhemos dados que preenche voluntariamente nos formulários deste site: nome, email, telefone e a mensagem ou informação associada ao pedido (contacto geral, pedido de avaliação para venda, candidatura à equipa, ou pré-análise de financiamento). Usamos estes dados exclusivamente para lhe responder e dar seguimento ao seu pedido — nunca para outro fim sem lho dizermos primeiro.",
  },
  {
    heading: "Exatidão da informação",
    body: "A informação que nos fornece é da sua responsabilidade. A RE/MAX Radial não verifica nem garante a exatidão dos dados submetidos e não se responsabiliza por consequências resultantes de informação incompleta, desatualizada ou incorreta fornecida pelo titular.",
  },
  {
    heading: "Base legal",
    body: "Tratamos os seus dados com base no seu consentimento, dado ao preencher e submeter voluntariamente um formulário, e no nosso interesse legítimo em responder a quem nos contacta.",
  },
  {
    heading: "Quem tem acesso aos seus dados",
    body: "Só os consultores e administradores da RE/MAX Radial têm acesso aos dados que nos envia, através de uma área interna protegida por autenticação. Não vendemos nem partilhamos os seus dados com terceiros para fins de marketing. Recorremos a prestadores de serviços tecnológicos de confiança (alojamento, base de dados e infraestrutura) para operar este site, sujeitos a obrigações contratuais de confidencialidade e proteção de dados, atuando exclusivamente como processadores técnicos — nunca para uso próprio. Se pedir uma pré-análise de financiamento, os dados dessa simulação são também partilhados com a MaxFinance Delta, mas só com a sua autorização explícita, dada no próprio formulário.",
  },
  {
    heading: "Quanto tempo guardamos os seus dados",
    body: "Guardamos os seus dados enquanto for necessário para responder ao seu pedido e, depois disso, pelo tempo razoável para eventual seguimento comercial — a não ser que peça a eliminação antes disso, o que fazemos sempre que solicitado.",
  },
  {
    heading: "Os seus direitos",
    body: "Tem o direito de aceder aos seus dados, corrigi-los, pedir a sua eliminação, opor-se ao tratamento ou pedir a portabilidade dos mesmos. Para exercer qualquer um destes direitos, contacte-nos através do formulário de contacto ou do telefone indicado acima. Tem também o direito de apresentar reclamação junto da Comissão Nacional de Proteção de Dados (CNPD)."
  },
  {
    heading: "Segurança da informação",
    body: "Adotamos medidas técnicas e organizativas razoáveis para proteger os seus dados. Ainda assim, nenhum sistema de transmissão ou armazenamento de dados é totalmente seguro, e não podemos garantir segurança absoluta. A RE/MAX Radial não se responsabiliza por acessos não autorizados resultantes de causas alheias ao seu controlo razoável.",
  },
  {
    heading: "Ligações a sites de terceiros",
    body: "Este site contém ligações para sites de terceiros (por exemplo, o portal oficial da RE/MAX, a MaxFinance Delta, ou o WhatsApp). Não somos responsáveis pelas práticas de privacidade nem pelo conteúdo desses sites — recomendamos que consulte as respetivas políticas antes de lhes fornecer dados pessoais.",
  },
  {
    heading: "Cookies",
    body: "Este site usa apenas cookies estritamente necessários ao seu funcionamento: para manter a sua sessão (se for consultor), lembrar a sua preferência de modo claro/escuro e a língua escolhida. Não usamos, atualmente, cookies de publicidade ou de análise de tráfego. Se isso mudar no futuro, atualizaremos esta política e pedir-lhe-emos consentimento antes de os ativar.",
  },
  {
    heading: "Uso indevido do site",
    body: "Reservamo-nos o direito de ignorar, rejeitar ou eliminar submissões que considerarmos fraudulentas, abusivas, automatizadas (bots) ou de outra forma indevidas, sem aviso prévio.",
  },
  {
    heading: "Menores de idade",
    body: "Este site não se dirige a menores de 18 anos e não recolhemos intencionalmente dados de menores.",
  },
  {
    heading: "Alterações a esta política",
    body: "Podemos atualizar esta política a qualquer momento, sem aviso prévio, para refletir mudanças no site, nas nossas práticas ou na lei. A data no topo desta página indica a última atualização — a utilização continuada do site após uma alteração implica a aceitação da versão atualizada.",
  },
];

export default function PrivacidadePage() {
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
