import { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import type { NovoCliente } from "@/lib/esteiras-types";
import { ETAPA_ORDER, formatEtapa } from "@/lib/esteiras-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import DetailModal from "./DetailModal";

interface Props {
  data: NovoCliente[];
}

export default function NovosClientesTab({ data }: Props) {
  const [search, setSearch] = useState("");
  const [filterConsultor, setFilterConsultor] = useState("");
  const [filterEtapa, setFilterEtapa] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<NovoCliente | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const consultores = useMemo(() => [...new Set(data.map((d) => d.nome_consultor))].sort(), [data]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const s = search.toLowerCase();
      if (s && !item.nome_associado.toLowerCase().includes(s) && !item.placa.toLowerCase().includes(s) && !item.codigo_veiculo.toLowerCase().includes(s)) return false;
      if (filterConsultor && item.nome_consultor !== filterConsultor) return false;
      if (filterEtapa && item.etapa !== filterEtapa) return false;
      if (dateFrom) {
        const d = new Date(item.data_contrato.replace(/^"|"$/g, ""));
        if (d < new Date(dateFrom)) return false;
      }
      if (dateTo) {
        const d = new Date(item.data_contrato.replace(/^"|"$/g, ""));
        if (d > new Date(dateTo + "T23:59:59")) return false;
      }
      return true;
    });
  }, [data, search, filterConsultor, filterEtapa, dateFrom, dateTo]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const da = new Date(a.data_atualizacao_etapa || a.criado).getTime();
      const db = new Date(b.data_atualizacao_etapa || b.criado).getTime();
      return db - da;
    });
  }, [filtered]);

  const grouped = useMemo(() => {
    const map: Record<string, NovoCliente[]> = {};
    ETAPA_ORDER.forEach((e) => (map[e] = []));
    sorted.forEach((item) => {
      if (map[item.etapa]) map[item.etapa].push(item);
      else map[item.etapa] = [item];
    });
    return map;
  }, [sorted]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-card rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Buscar por nome, placa ou código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-muted-foreground hover:bg-accent"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <select
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              value={filterConsultor}
              onChange={(e) => setFilterConsultor(e.target.value)}
            >
              <option value="">Todos consultores</option>
              {consultores.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              value={filterEtapa}
              onChange={(e) => setFilterEtapa(e.target.value)}
            >
              <option value="">Todas etapas</option>
              {ETAPA_ORDER.map((e) => (
                <option key={e} value={e}>{formatEtapa(e)}</option>
              ))}
            </select>
            <input
              type="date"
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Contrato de"
            />
            <input
              type="date"
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Contrato até"
            />
          </div>
        )}
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {ETAPA_ORDER.map((etapa) => {
          const items = grouped[etapa] || [];
          const total = items.reduce((s, i) => s + (i.mensalidade || 0), 0);
          return (
            <div key={etapa} className="min-w-[280px] max-w-[320px] flex-shrink-0">
              <div className="bg-card rounded-xl shadow-sm">
                {/* Column header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{formatEtapa(etapa)}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {items.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatCurrency(total)}</p>
                </div>
                {/* Cards */}
                <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">Nenhum item</p>
                  ) : (
                    items.map((item, idx) => (
                      <div
                        key={`${item.placa}-${idx}`}
                        onClick={() => setSelected(item)}
                        className="bg-background rounded-lg p-3 border border-border hover:shadow-md transition cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {item.placa}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatCurrency(item.mensalidade)}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">{item.nome_associado}</p>
                        <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                          <span>Contrato: {formatDate(item.data_contrato)}</span>
                          <span>Venc.: {formatDate(item.data_vencimento)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{item.nome_consultor}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <DetailModal title="Detalhes do Cliente" onClose={() => setSelected(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Placa" value={selected.placa} />
            <Field label="Nome" value={selected.nome_associado} />
            <Field label="Consultor" value={selected.nome_consultor} />
            <Field label="Código Veículo" value={selected.codigo_veiculo} />
            <Field label="Data Contrato" value={formatDate(selected.data_contrato)} />
            <Field label="Vencimento" value={formatDate(selected.data_vencimento)} />
            <Field label="Mensalidade" value={formatCurrency(selected.mensalidade)} />
            <Field label="Etapa" value={formatEtapa(selected.etapa)} />
            <Field label="Atualização Etapa" value={formatDate(selected.data_atualizacao_etapa || "")} />
            <Field label="Criado" value={formatDate(selected.criado)} />
          </div>
        </DetailModal>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "-"}</p>
    </div>
  );
}
