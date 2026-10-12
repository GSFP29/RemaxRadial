"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { criarEvento, removerEvento } from "@/app/painel/(protected)/calendario/actions";
import {
  COR_TIPO,
  DIAS_SEMANA,
  ROTULO_TIPO,
  chaveDia,
  formatarDiaMesPt,
  formatarHora,
  formatarMesAnoPt,
  grelhaDoMes,
  type EventoCalendario,
} from "@/lib/calendario-formato";
import type { ConsultorBasico } from "@/lib/consultores";

type Props = {
  ano: number;
  mes: number;
  eventos: EventoCalendario[];
  proximos: EventoCalendario[];
  consultorId: string;
  isAdmin: boolean;
  consultores: ConsultorBasico[];
};

export function CalendarioMensal({
  ano,
  mes,
  eventos,
  proximos,
  consultorId,
  isAdmin,
  consultores,
}: Props) {
  const hoje = new Date();
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(
    hoje.getFullYear() === ano && hoje.getMonth() === mes ? hoje : null,
  );
  const [aAdicionar, setAAdicionar] = useState(false);
  const [aAtribuirEscala, setAAtribuirEscala] = useState(false);

  const grelha = grelhaDoMes(ano, mes);

  const eventosPorDia = useMemo(() => {
    const mapa = new Map<string, EventoCalendario[]>();
    for (const ev of eventos) {
      const chave = chaveDia(new Date(ev.data_inicio));
      const lista = mapa.get(chave) ?? [];
      lista.push(ev);
      mapa.set(chave, lista);
    }
    return mapa;
  }, [eventos]);

  const mesAnterior = mes === 0 ? { ano: ano - 1, mes: 11 } : { ano, mes: mes - 1 };
  const mesSeguinte = mes === 11 ? { ano: ano + 1, mes: 0 } : { ano, mes: mes + 1 };

  const eventosDoDia = diaSelecionado ? (eventosPorDia.get(chaveDia(diaSelecionado)) ?? []) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{formatarMesAnoPt(ano, mes)}</h2>
          <div className="flex gap-1">
            <Link
              href={`/painel/calendario?ano=${mesAnterior.ano}&mes=${mesAnterior.mes}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-grid hover:border-brand-blue"
            >
              <ChevronLeft size={15} />
            </Link>
            <Link
              href={`/painel/calendario?ano=${mesSeguinte.ano}&mes=${mesSeguinte.mes}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-grid hover:border-brand-blue"
            >
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-foreground-secondary">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="pb-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grelha.map(({ data, doMesAtual }) => {
            const chave = chaveDia(data);
            const eventosDia = eventosPorDia.get(chave) ?? [];
            const ehHoje = chaveDia(hoje) === chave;
            const ehSelecionado = diaSelecionado && chaveDia(diaSelecionado) === chave;
            const tiposPresentes = [...new Set(eventosDia.map((e) => e.tipo))];

            return (
              <button
                key={chave}
                type="button"
                onClick={() => {
                  setDiaSelecionado(data);
                  setAAdicionar(false);
                }}
                className={`flex aspect-square flex-col items-center justify-start gap-1 rounded-lg border p-1.5 pt-2 text-sm transition ${
                  ehSelecionado
                    ? "border-brand-blue bg-brand-blue/5"
                    : "border-transparent hover:border-grid"
                } ${!doMesAtual ? "opacity-35" : ""}`}
              >
                <span className={`font-medium ${ehHoje ? "flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-white" : ""}`}>
                  {data.getDate()}
                </span>
                <span className="flex gap-0.5">
                  {tiposPresentes.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className={`h-1.5 w-1.5 rounded-full ${COR_TIPO[t].split(" ")[0]}`}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {diaSelecionado && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold">{formatarDiaMesPt(diaSelecionado.toISOString())}</h3>
              <button
                type="button"
                onClick={() => setAAdicionar((v) => !v)}
                className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition hover:brightness-110"
              >
                <Plus size={16} /> Novo evento
              </button>
            </div>

            {aAdicionar && (
              <form
                action={criarEvento}
                onSubmit={() => setAAdicionar(false)}
                className="mb-4 flex flex-col gap-2 rounded-lg border border-grid p-3"
              >
                <input type="hidden" name="consultorId" value={consultorId} />
                <input type="hidden" name="data" value={chaveDia(diaSelecionado)} />
                <input
                  name="titulo"
                  required
                  placeholder="Título"
                  className="w-full rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
                />
                <div className="flex gap-2">
                  <select
                    name="tipo"
                    defaultValue="visita"
                    className="w-1/2 rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
                  >
                    <option value="visita">Visita</option>
                    <option value="pessoal">Pessoal</option>
                    <option value="outro">Outro</option>
                  </select>
                  <input
                    name="hora"
                    type="time"
                    defaultValue="09:00"
                    className="w-1/2 rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
                  />
                </div>
                <input
                  name="clienteAssociado"
                  placeholder="Cliente associado (opcional)"
                  className="w-full rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
                />
                <textarea
                  name="notas"
                  placeholder="Notas (opcional)"
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

            {eventosDoDia.length === 0 ? (
              <p className="text-sm text-foreground-secondary">Sem eventos neste dia.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {eventosDoDia.map((ev) => (
                  <li key={ev.id} className="rounded-lg border border-grid p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${COR_TIPO[ev.tipo]}`}
                        >
                          {ROTULO_TIPO[ev.tipo]}
                        </span>
                        <p className="font-medium">{ev.titulo}</p>
                        <p className="text-xs text-foreground-secondary">
                          {formatarHora(ev.data_inicio)}
                          {ev.cliente_associado && ` · ${ev.cliente_associado}`}
                        </p>
                        {ev.notas && (
                          <p className="mt-1 text-xs text-foreground-secondary">{ev.notas}</p>
                        )}
                      </div>
                      <form action={removerEvento}>
                        <input type="hidden" name="id" value={ev.id} />
                        <button
                          type="submit"
                          className="text-xs text-foreground-secondary hover:text-brand-red"
                        >
                          Remover
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div>
          <h3 className="mb-3 font-semibold">Próximos eventos</h3>
          {proximos.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Sem eventos agendados.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {proximos.map((ev) => (
                <li key={ev.id} className="flex items-center gap-2 text-sm">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${COR_TIPO[ev.tipo].split(" ")[0]}`} />
                  <span className="text-xs text-foreground-secondary">
                    {formatarDiaMesPt(ev.data_inicio)}
                  </span>
                  <span className="truncate">{ev.titulo}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isAdmin && (
          <div className="rounded-lg border border-brand-red/30 bg-brand-red/[0.03] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Atribuir escala</h3>
              <button
                type="button"
                onClick={() => setAAtribuirEscala((v) => !v)}
                className="text-xs font-semibold text-brand-red"
              >
                {aAtribuirEscala ? "Cancelar" : "+ Atribuir"}
              </button>
            </div>
            {aAtribuirEscala && (
              <form
                action={criarEvento}
                onSubmit={() => setAAtribuirEscala(false)}
                className="flex flex-col gap-2"
              >
                <input type="hidden" name="tipo" value="escala" />
                <input type="hidden" name="titulo" value="Escala" />
                <input type="hidden" name="hora" value="09:00" />
                <select
                  name="consultorId"
                  required
                  className="w-full rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
                >
                  <option value="">Consultor...</option>
                  {consultores.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                <input
                  name="data"
                  type="date"
                  required
                  className="w-full rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
                />
                <button
                  type="submit"
                  className="w-fit rounded-md bg-brand-red px-4 py-1.5 text-xs font-semibold text-white hover:brightness-110"
                >
                  Atribuir
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
