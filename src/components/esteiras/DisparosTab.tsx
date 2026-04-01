import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import type { Disparo } from "@/lib/esteiras-types";
import { formatDate } from "@/lib/utils";
import DetailModal from "./DetailModal";

interface Props {
  data: Disparo[];
}

export default function DisparosTab({ data }: Props) {
  const [search, setSearch] = useState("");
  const [filterConsultor, setFilterConsultor] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterEsteira, setFilterEsteira] = useState("");
  const [filterEtapa, setFilterEtapa] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<Disparo | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const consultores = useMemo(() => [...new Set(data.map((d) => d.nome_consultor))].sort(), [data]);
  const tipos = useMemo(() => [...new Set(data.map((d) => d.tipo))].sort(), [data]);
  const esteiras = useMemo(() => [...new Set(data.map((d) => d.esteira))].sort(), [data]);
  const etapas = useMemo(() => [...new Set(data.map((d) => d.etapa))].sort(), [data]);

  const filtered = useMemo(() => {
    return data
      .filter((item) => {
        const s = search.toLowerCase();
        if (s && !item.placa.toLowerCase().includes(s) && !item.codigo_veiculo.toLowerCase().includes(s) && !item.descricao.toLowerCase().includes(s) && !item.nome_consultor.toLowerCase().includes(s)) return false;
        if (filterConsultor && item.nome_consultor !== filterConsultor) return false;
        if (filterTipo && item.tipo !== filterTipo) return false;
        if (filterEsteira && item.esteira !== filterEsteira) return false;
        if (filterEtapa && item.etapa !== filterEtapa) return false;
        if (dateFrom && new Date(item.criado) < new Date(dateFrom)) return false;
        if (dateTo && new Date(item.criado) > new Date(dateTo + "T23:59:59")) return false;
        return true;
      })
      .sort((a, b) => new Date(b.criado).getTime() - new Date(a.criado).getTime());
  }, [data, search, filterConsultor, filterTipo, filterEsteira, filterEtapa, dateFrom, dateTo]);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Buscar por placa, código, descrição ou consultor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-muted-foreground hover:bg-accent">
            <Filter className="h-4 w-4" /> Filtros
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <select className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm" value={filterConsultor} onChange={(e) => setFilterConsultor(e.target.value)}>
              <option value="">Todos consultores</option>
              {consultores.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
              <option value="">Todos tipos</option>
              {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm" value={filterEsteira} onChange={(e) => setFilterEsteira(e.target.value)}>
              <option value="">Todas esteiras</option>
              {esteiras.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <select className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm" value={filterEtapa} onChange={(e) => setFilterEtapa(e.target.value)}>
              <option value="">Todas etapas</option>
              {etapas.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <input type="date" className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <input type="date" className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                {["Tipo", "Esteira", "Etapa", "Placa", "Consultor", "Cód. Veículo", "Descrição", "Criado"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">Nenhum disparo encontrado</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} onClick={() => setSelected(item)} className="hover:bg-accent/50 cursor-pointer transition">
                    <td className="px-4 py-3 whitespace-nowrap"><span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{item.tipo}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.esteira}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.etapa}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{item.placa}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.nome_consultor}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.codigo_veiculo}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{item.descricao}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.criado)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <DetailModal title="Detalhes do Disparo" onClose={() => setSelected(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(selected).map(([key, val]) => (
              <div key={key}>
                <p className="text-xs text-muted-foreground">{key}</p>
                <p className="text-sm font-medium text-foreground">{key === "criado" ? formatDate(String(val)) : String(val)}</p>
              </div>
            ))}
          </div>
        </DetailModal>
      )}
    </div>
  );
}
