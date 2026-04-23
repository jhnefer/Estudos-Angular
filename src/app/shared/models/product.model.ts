export interface Product {
  // Identificação (Chave Primária Composta)
  pr_codigo: string;
  pr_tp: string;
  
  // Identificação - Outros
  pr_descricao?: string;
  pr_description?: string;
  pr_prefixo?: string;
  pr_numero?: string;
  pr_extensao?: string;
  pr_codbarra?: string;
  pr_barrateste?: string;

  // Classificação
  pr_classif?: string;
  pr_grupo?: number;
  pr_marca?: string;
  pr_especie?: string;
  pr_tipo?: string;
  pr_ativo?: string; // 'SIM' | 'NAO'
  pr_estoque?: string; // 'SIM' | 'NAO'

  // Unidade e Conversão
  pr_unidade?: string;
  pr_segum?: string;
  pr_conversao?: number;
  pr_fator?: number;

  // Valores e Custos
  pr_valorvenda?: number;
  pr_custo?: number;
  pr_custo2?: number;
  pr_custo3?: number;

  // Fiscal
  pr_cst?: string;
  pr_cfop?: string;
  pr_percicms?: number;
  pr_reduicms?: number;
  pr_numerario?: string;

  // Logística
  pr_almoxarifado?: number;
  pr_regiao?: number;
  pr_minimo?: number;
  pr_edicao?: string | Date | null;
  pr_edi?: string;

  // Integração
  pr_codprogress?: number;
  pr_impa?: string;
  pr_issa?: string;
}
