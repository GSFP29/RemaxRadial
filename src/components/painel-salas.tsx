"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cancelarReserva, reservarSala } from "@/app/painel/(protected)/salas/actions";
import {
  SALAS,
  dataISO,
  formatarDataPt,
  horariosDoDay,
  type ReservaSala,
  type Sala,
} from "@/lib/salas-formato";
import type { ConsultorBasico } from "@/lib/consultores";

type Props = {
  data: string;
  reservas: ReservaSala[];
  consultores: ConsultorBasico[];
  consultorAtualId: string;
};

export function PainelSalas({ data, reservas, consultores, consultorAtualId }: Props) {
  const [celulaAtiva, setCelulaAtiva] = useState<{ sala: Sala; hora: string } | null>(null);
  const horarios = horariosDoDay();
  const nomePorId = new Map(consultores.map((c) => [c.id, c.nome]));

  const reservaEm = (sala: Sala, hora: string) =>
    reservas.find((r) => r.sala === sala && r.hora_inicio.startsWith(hora));

  const hoje = dataISO(new Date());
  const anterior = new Date(data);
  anterior.setDate(anterior.getDate() - 1);
  const seguinte = new Date(data);
  seguinte.setDate(seguinte.getDate() + 1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">{formatarDataPt(data)}</h2>
        <div className="flex items-center gap-2">
          <Link
            href={`/painel/salas?data=${dataISO(anterior)}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-grid hover:border-brand-blue"
          >
            <ChevronLeft size={15} />
          </Link>
          {data !== hoje && (
            <Link
              href={`/painel/salas?data=${hoje}`}
              className="rounded-full border border-grid px-3 py-1 text-xs font-semibold hover:border-brand-blue"
            >
              Hoje
            </Link>
          )}
          <Link
            href={`/painel/salas?data=${dataISO(seguinte)}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-grid hover:border-brand-blue"
          >
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-grid">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-grid bg-brand-blue/[0.03]">
              <th className="w-20 px-3 py-2 text-left font-medium text-foreground-secondary">
                Hora
              </th>
              {SALAS.map((sala) => (
                <th key={sala} className="px-3 py-2 text-left font-medium">
                  {sala}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horarios.map((hora) => (
              <tr key={hora} className="border-b border-grid last:border-0">
                <td className="px-3 py-1.5 text-xs text-foreground-secondary">{hora}</td>
                {SALAS.map((sala) => {
                  const reserva = reservaEm(sala, hora);
                  const ehMinha = reserva?.consultor_id === consultorAtualId;
                  const ativa = celulaAtiva?.sala === sala && celulaAtiva?.hora === hora;

                  if (reserva) {
                    return (
                      <td key={sala} className="px-1.5 py-1">
                        <div
                          className={`rounded-md px-2 py-1.5 text-xs ${
                            ehMinha
                              ? "bg-brand-blue/10 text-brand-blue"
                              : "bg-foreground/[0.06] text-foreground-secondary"
                          }`}
                        >
                          <p className="font-semibold">
                            {nomePorId.get(reserva.consultor_id) ?? "Reservado"}
                          </p>
                          {reserva.cliente_associado && <p>{reserva.cliente_associado}</p>}
                          {ehMinha && (
                            <form action={cancelarReserva}>
                              <input type="hidden" name="id" value={reserva.id} />
                              <button
                                type="submit"
                                className="mt-0.5 text-xs underline hover:text-brand-red"
                              >
                                Cancelar
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={sala} className="px-1.5 py-1">
                      {ativa ? (
                        <form
                          action={reservarSala}
                          onSubmit={() => setCelulaAtiva(null)}
                          className="flex flex-col gap-1"
                        >
                          <input type="hidden" name="sala" value={sala} />
                          <input type="hidden" name="data" value={data} />
                          <input type="hidden" name="horaInicio" value={hora} />
                          <input type="hidden" name="consultorId" value={consultorAtualId} />
                          <input
                            name="clienteAssociado"
                            placeholder="Cliente (opcional)"
                            autoFocus
                            className="w-full rounded-md border border-brand-blue px-2 py-1 text-xs outline-none"
                          />
                          <div className="flex gap-1">
                            <button
                              type="submit"
                              className="flex-1 rounded-md bg-brand-blue px-2 py-1 text-xs font-semibold text-white"
                            >
                              Reservar
                            </button>
                            <button
                              type="button"
                              onClick={() => setCelulaAtiva(null)}
                              className="rounded-md border border-grid px-2 py-1 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCelulaAtiva({ sala, hora })}
                          className="h-8 w-full rounded-md border border-dashed border-grid text-xs text-foreground-secondary transition hover:border-brand-blue hover:text-brand-blue"
                        >
                          Livre
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
