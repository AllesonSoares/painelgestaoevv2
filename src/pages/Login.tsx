import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://evogard.com/webhook/3597/consultor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/3597/consultor/login", usuario: user, senha: pass }),
      });
      const data = await res.json();
      const d = Array.isArray(data) ? data[0] : data;
      if (d?.request === "sucesso") {
        sessionStorage.setItem("auth_id_user", d.id_user || "");
        sessionStorage.setItem("auth_id_nivel", d.id_nivel || "");
        sessionStorage.setItem("auth_codigo_voluntario", d.codigo_voluntario || "");
        sessionStorage.setItem("auth_nome", d.nome || "");
        navigate("/inicio");
      } else {
        alert("Credenciais inválidas");
      }
    } catch {
      alert("Erro ao conectar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-foreground">Evogard</h1>
          <p className="text-sm text-muted-foreground">Acesse seu painel</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            type="password"
            placeholder="Senha"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
