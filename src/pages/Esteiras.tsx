import { useState, useEffect, useMemo } from "react";
import { Users, Send, Mail, RefreshCw, CreditCard, Loader2 } from "lucide-react";
import type { EsteirasData } from "@/lib/esteiras-types";
import NovosClientesTab from "@/components/esteiras/NovosClientesTab";
import DisparosTab from "@/components/esteiras/DisparosTab";
import TrackingEmailTab from "@/components/esteiras/TrackingEmailTab";
import ComingSoonTab from "@/components/esteiras/ComingSoonTab";

const TABS = [
  { key: "novos_clientes", label: "Novos Clientes", icon: Users },
  { key: "disparos", label: "Disparos", icon: Send },
  { key: "tracking", label: "Tracking de Email", icon: Mail },
  { key: "renovacao", label: "Renovação", icon: RefreshCw },
  { key: "cobranca", label: "Cobrança", icon: CreditCard },
] as const;

const LOADING_PHRASES = [
  "Carregando esteiras...",
  "Buscando dados...",
  "Preparando informações...",
  "Quase lá...",
];

export default function Esteiras() {
  const [activeTab, setActiveTab] = useState("novos_clientes");
  const [data, setData] = useState<EsteirasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % LOADING_PHRASES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          path: "/3597/consultor/esteiras",
          auth_id_user: sessionStorage.getItem("auth_id_user") || "",
          auth_id_nivel: sessionStorage.getItem("auth_id_nivel") || "",
          auth_codigo_voluntario: sessionStorage.getItem("auth_codigo_voluntario") || "",
          auth_nome: sessionStorage.getItem("auth_nome") || "",
        };
        const res = await fetch("https://evogard.com/webhook/3597/consultor/esteiras", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        const d = Array.isArray(json) ? json[0] : json;
        if (d?.request === "sucesso") {
          setData(d);
        } else {
          setError("Não foi possível carregar os dados.");
        }
      } catch {
        setError("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm animate-pulse">{LOADING_PHRASES[phraseIdx]}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Esteiras</h1>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div>
        {activeTab === "novos_clientes" && <NovosClientesTab data={data?.novos_clientes || []} />}
        {activeTab === "disparos" && <DisparosTab data={data?.disparos || []} />}
        {activeTab === "tracking" && <TrackingEmailTab data={data?.tracking_email || []} />}
        {activeTab === "renovacao" && <ComingSoonTab title="Renovação" icon={RefreshCw} />}
        {activeTab === "cobranca" && <ComingSoonTab title="Cobrança" icon={CreditCard} />}
      </div>
    </div>
  );
}
