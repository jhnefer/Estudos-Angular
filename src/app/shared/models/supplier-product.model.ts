export interface SupplierProduct {
  for_codigo: string;     // ID do Fornecedor
  for_nome?: string;      // Nome (para exibição no grid)
  pr_codigo: string;      // Código Interno do Produto
  pr_tp: string;          // Tipo do Produto (Chave composta)
  
  cod_prod_forn: string;  // Código no catálogo do fornecedor
  cod_cli_forn: string;   // Código que o fornecedor usa para nos identificar
  
  unidade_compra: string; // Ex: CX, PCT, UN
  fator_conversao: number;// Ex: 12.000
  
  preco_ultima_compra?: number;
  data_ultima_compra?: Date | string | null;
}
