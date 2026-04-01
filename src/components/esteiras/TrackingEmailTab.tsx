import { useState, useMemo } from "react";
import { Search, Filter, Check, X as XIcon } from "lucide-react";
import type { TrackingEmail } from "@/lib/esteiras-types";
import { formatDate } from "@/lib/utils";
import DetailModal from "./DetailModal";

interface Props {
  data: TrackingEmail[];
}

function BoolBadge({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
      <Check className="h-3 w-3" /> Sim
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
      <XIcon className="h-3 w-3" /> Não
    </span>
  );
}

export default function TrackingEmailTab({ data }: Props) {
  const [search, setSearch] = useState("");
  const [filterConsultor, setFilterConsultor] = useState("");
  const [filterOrigem, setFilterOrigem] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<TrackingEmail | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const consultores = useMemo(() => [...new Set(data.map((d) => d.nome_consultor))].sort(), [data]);
  const origens = useMemo(() => [...new Set(data.map((d) => d.origem))].sort(), [data]);

  const filtered = useMemo(() => {
    return data
      .filter((item) => {
        const s = search.toLowerCase();
        if (s && !item.codigo_veiculo.toLowerCase().includes(s) && !item.email_cliente.toLowerCase().includes(s) && !item.email_consultor.toLowerCase().includes(s) && !item.email_gestor.toLowerCase().includes(s) && !item.nome_consultor.toLowerCase().includes(s)) return false;
        if (filterConsultor && item.nome_consultor !== filterConsultor) return false;
        if (filterOrigem && item.origem !== filterOrigem) return false;
        if (dateFrom && new Date(item.criado) < new Date(dateFrom)) return false;
        if (dateTo && new Date(item.criado) > new Date(dateTo + "T23:59:59")) return false;
        return true;
      })
      .sort((a, b) => new Date(b.criado).getTime() - new Date(a.criado).getTime());
  }, [data, search, filterConsultor, filterOrigem, dateFrom, dateTo]);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Buscar por código, email ou consultor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-muted-foreground hover:bg-accent">
            <Filter className="h-4 w-4" /> Filtros
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <select className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm" value={filterConsultor} onChange={(e) => setFilterConsultor(e.target.value)}>
              <option value="">Todos consultores</option>
              {consultores.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm" value={filterOrigem} onChange={(e) => setFilterOrigem(e.target.value)}>
              <option value="">Todas origens</option>
              {origens.map((o) => <option key={o} value={o}>{o}</option>)}
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
                {["Cód. Veículo", "Consultor", "Origem", "Criado", "Email Cliente", "Abriu", "Clicou", "Email Consultor", "Abriu", "Clicou", "Email Gestor", "Abriu", "Clicou"].map((h, i) => (
                  <th key={i} className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={13} className="px-4 py-12 text-center text-muted-foreground">Nenhum tracking encontrado</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} onClick={() => setSelected(item)} className="hover:bg-accent/50 cursor-pointer transition">
                    <td className="px-3 py-3 whitespace-nowrap font-medium">{item.codigo_veiculo}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{item.nome_consultor}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{item.origem}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{formatDate(item.criado)}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs">{item.email_cliente}</td>
                    <td className="px-3 py-3"><BoolBadge value={item.abertura_email_cliente} /></td>
                    <td className="px-3 py-3"><BoolBadge value={item.click_botao_cliente} /></td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs">{item.email_consultor}</td>
                    <td className="px-3 py-3"><BoolBadge value={item.abertura_email_consultor} /></td>
                    <td className="px-3 py-3"><BoolBadge value={item.click_botao_consultor} /></td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs">{item.email_gestor}</td>
                    <td className="px-3 py-3"><BoolBadge value={item.abertura_email_gestor} /></td>
                    <td className="px-3 py-3"><BoolBadge value={item.click_botao_gestor} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <DetailModal title="Detalhes do Tracking" onClose={() => setSelected(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><p className="text-xs text-muted-foreground">Cód. Veículo</p><p className="text-sm font-medium">{selected.codigo_veiculo}</p></div>
            <div><p className="text-xs text-muted-foreground">Consultor</p><p className="text-sm font-medium">{selected.nome_consultor}</p></div>
            <div><p className="text-xs text-muted-foreground">Cód. Voluntário</p><p className="text-sm font-medium">{selected.codigo_voluntario}</p></div>
            <div><p className="text-xs text-muted-foreground">Origem</p><p className="text-sm font-medium">{selected.origem}</p></div>
            <div><p className="text-xs text-muted-foreground">Criado</p><p className="text-sm font-medium">{formatDate(selected.criado)}</p></div>
            <div className="col-span-full border-t border-border pt-3 mt-1"><p className="text-xs font-semibold text-foreground mb-2">Cliente</p></div>
            <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{selected.email_cliente}</p></div>
            <div><p className="text-xs text-muted-foreground">Abertura</p><BoolBadge value={selected.abertura_email_cliente} /></div>
            <div><p className="text-xs text-muted-foreground">Clique</p><BoolBadge value={selected.click_botao_cliente} /></div>
            <div className="col-span-full border-t border-border pt-3 mt-1"><p className="text-xs font-semibold text-foreground mb-2">Consultor</p></div>
            <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{selected.email_consultor}</p></div>
            <div><p className="text-xs text-muted-foreground">Abertura</p><BoolBadge value={selected.abertura_email_consultor} /></div>
            <div><p className="text-xs text-muted-foreground">Clique</p><BoolBadge value={selected.click_botao_consultor} /></div>
            <div className="col-span-full border-t border-border pt-3 mt-1"><p className="text-xs font-semibold text-foreground mb-2">Gestor</p></div>
            <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{selected.email_gestor}</p></div>
            <div><p className="text-xs text-muted-foreground">Abertura</p><BoolBadge value={selected.abertura_email_gestor} /></div>
            <div><p className="text-xs text-muted-foreground">Clique</p><BoolBadge value={selected.click_botao_gestor} /></div>
          </div>
        </DetailModal>
      )}
    </div>
  );
}
