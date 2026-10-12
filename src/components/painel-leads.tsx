"use client";

import { useState } from "react";
import { atribuirLead, atualizarLead } from "@/app/painel/(protected)/leads/actions";
import {
  COR_ESTADO,
  ESTADOS_LEAD,
  ROTULO_ESTADO,
  ROTULO_ORIGEM,
  estaEmAtraso,
  tempoParado,
  type Lead,
} from "@/lib/leads-formato";
import type { ConsultorBasico } from "@/lib/consultores";

export function PainelLeads({
  minhasLeads,
  porAtribuir,
  consultores,
  isAdmin,
}: {
  minhasLeads: Lead[];
  porAtribuir: Lead[];
  consultores: ConsultorBasico[];
  isAdmin: boolean;
}) {
  return (
    <div className="flex flex-col gap-10">
      {isAdmin && porAtribuir.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-brand-red uppercase">
            Leads por atribuir
            <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-xs font-bold text-brand-red">
              {porAtribuir.length}
            </span>
          </h2>
          <div className="flex flex-col gap-3">
            {porAtribuir.map((lead) => (
              <div key={lead.id} className="rounded-xl border border-brand-red/30 bg-brand-red/[0.03] p-4">
                <CabecalhoLead lead={lead} />
                <form action={atribuirLead} className="mt-3 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={lead.id} />
                  <select
                    name="consultorId"
                    required
                    className="rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
                  >
                    <option value="">Atribuir a...</option>
                    {consultores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-md bg-brand-red px-4 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                  >
                    Atribuir
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-bold tracking-wide text-foreground-secondary uppercase">
          As minhas leads
        </h2>
        {minhasLeads.length === 0 ? (
          <p className="rounded-xl border border-dashed border-grid p-6 text-sm text-foreground-secondary">
            Sem leads atribuídas por agora.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {minhasLeads.map((lead) => (
              <CartaoLead key={lead.id} lead={lead} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CabecalhoLead({ lead }: { lead: Lead }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <p className="font-semibold">{lead.nome ?? "Sem nome"}</p>
        <p className="text-sm text-foreground-secondary">
          {[lead.telefone, lead.email].filter(Boolean).join(" · ") || "Sem contacto"}
        </p>
      </div>
      <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-xs font-medium text-foreground-secondary">
        {ROTULO_ORIGEM[lead.origem] ?? lead.origem}
      </span>
      {lead.mensagem && <p className="w-full text-sm text-foreground-secondary">{lead.mensagem}</p>}
    </div>
  );
}

function CartaoLead({ lead }: { lead: Lead }) {
  const [aEditar, setAEditar] = useState(false);
  const atrasado = estaEmAtraso(lead);

  return (
    <div
      className={`rounded-xl border p-4 ${
        atrasado ? "border-brand-red/40 bg-brand-red/[0.03]" : "border-grid"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{lead.nome ?? "Sem nome"}</p>
          <p className="text-sm text-foreground-secondary">
            {[lead.telefone, lead.email].filter(Boolean).join(" · ") || "Sem contacto"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-xs font-medium text-foreground-secondary">
            {ROTULO_ORIGEM[lead.origem] ?? lead.origem}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${COR_ESTADO[lead.estado] ?? ""}`}>
            {ROTULO_ESTADO[lead.estado] ?? lead.estado}
          </span>
        </div>
      </div>

      {lead.mensagem && <p className="mt-2 text-sm text-foreground-secondary">{lead.mensagem}</p>}
      {lead.notas && !aEditar && (
        <p className="mt-2 rounded-md bg-foreground/[0.04] p-2 text-sm">{lead.notas}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className={`text-xs ${atrasado ? "font-semibold text-brand-red" : "text-foreground-secondary"}`}>
          {atrasado ? "Em atraso — " : "Última atividade "}
          {tempoParado(lead)}
        </p>
        <button
          type="button"
          onClick={() => setAEditar((v) => !v)}
          className="text-xs font-semibold text-brand-blue"
        >
          {aEditar ? "Cancelar" : "Atualizar"}
        </button>
      </div>

      {aEditar && (
        <form
          action={atualizarLead}
          onSubmit={() => setAEditar(false)}
          className="mt-3 flex flex-col gap-2 border-t border-grid pt-3"
        >
          <input type="hidden" name="id" value={lead.id} />
          <select
            name="estado"
            defaultValue={lead.estado}
            className="w-full rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
          >
            {ESTADOS_LEAD.map((e) => (
              <option key={e} value={e}>
                {ROTULO_ESTADO[e]}
              </option>
            ))}
          </select>
          <textarea
            name="notas"
            defaultValue={lead.notas ?? ""}
            placeholder="Notas do acompanhamento..."
            rows={2}
            className="w-full rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
          />
          <button
            type="submit"
            className="w-fit rounded-md bg-brand-blue px-4 py-1.5 text-xs font-semibold text-white hover:brightness-110"
          >
            Guardar
          </button>
        </form>
      )}
    </div>
  );
}
