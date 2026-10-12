"use client";

import { useState } from "react";

// Ver src/lib/anti-spam.ts para a validação do lado do servidor. O campo
// "empresa" é o isco (honeypot) — nome pensado para parecer legítimo a um
// preenchimento automático de bot, mas nenhuma pessoa o vê nem o preenche.
export function CampoAntiSpam() {
  const [carregadoEm] = useState(() => Date.now());

  return (
    <>
      <input
        type="text"
        name="empresa"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <input type="hidden" name="carregadoEm" value={carregadoEm} />
    </>
  );
}
