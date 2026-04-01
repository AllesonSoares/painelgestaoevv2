export const ETAPA_MAP: Record<string, string> = {
  "gerar boleto": "Gerar Boleto",
  "enviado WhatsApp": "Enviar via Whatsapp",
  "enviado_email": "Enviar via Email",
  "informativo_boleto": "Informativo + Boleto",
  "nps": "NPS",
  "informativo": "Informativo",
};

export const ETAPA_ORDER = [
  "gerar boleto",
  "enviado WhatsApp",
  "enviado_email",
  "informativo_boleto",
  "nps",
  "informativo",
];

export function formatEtapa(raw: string): string {
  return ETAPA_MAP[raw] || raw;
}

export interface NovoCliente {
  placa: string;
  nome_associado: string;
  data_contrato: string;
  nome_consultor: string;
  data_vencimento: string;
  mensalidade: number;
  etapa: string;
  codigo_veiculo: string;
  data_atualizacao_etapa?: string;
  criado: string;
}

export interface Disparo {
  id: number;
  tipo: string;
  esteira: string;
  etapa: string;
  placa: string;
  nome_consultor: string;
  codigo_veiculo: string;
  descricao: string;
  criado: string;
}

export interface TrackingEmail {
  id: number;
  codigo_veiculo: string;
  email_cliente: string;
  abertura_email_cliente: boolean;
  click_botao_cliente: boolean;
  email_consultor: string;
  abertura_email_consultor: boolean;
  click_botao_consultor: boolean;
  email_gestor: string;
  abertura_email_gestor: boolean;
  click_botao_gestor: boolean;
  origem: string;
  criado: string;
  codigo_voluntario: string;
  nome_consultor: string;
}

export interface EsteirasData {
  request: string;
  novos_clientes: NovoCliente[];
  disparos: Disparo[];
  tracking_email: TrackingEmail[];
  renovacao: unknown[];
  cobranca: unknown[];
}
