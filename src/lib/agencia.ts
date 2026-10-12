// Contacto público da agência (não de um consultor específico) — usado no
// botão "Contactar a Agência" das fichas de imóvel. Enquanto
// `whatsapp`/`telefone` forem null, o botão correspondente não aparece.
export const AGENCIA = {
  // PROVISÓRIO (24 Ago 2026) — o WhatsApp Business ainda não existe.
  // Pedido explícito do cliente: mostrar já a interface com o número de
  // telefone normal, mesmo sabendo que não vai abrir uma conversa de
  // WhatsApp real. Trocar por o número do WhatsApp Business assim que
  // existir — é só esta linha.
  whatsapp: "351219349100" as string | null,
  telefone: "+351 219 349 100" as string | null,
  // Morada completa (26/31 Ago 2026, confirmada com o cliente e cruzada com
  // o site atual radial.pt), com link direto ao Google Maps do escritório.
  morada: "Av. 25 de Abril, 22A, 2620-186 Ramada" as string | null,
  urlMapa:
    "https://www.google.pt/maps/place//data=!4m2!3m1!1s0xd192d4ea85834e7:0xeacb5eed07e5a6d6?sa=X&ved=1t:8290&ictx=111" as string | null,
};

export function urlWhatsapp(mensagem?: string): string | null {
  if (!AGENCIA.whatsapp) return null;
  const base = `https://wa.me/${AGENCIA.whatsapp}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}
