export interface Supplier {
  for_codigo: number;
  for_nome: string;
  for_fantasia: string;
  for_cnpj: string;
  for_ie: string;
  for_tipo: 'G' | 'S' | 'M';
  for_cep: string;
  for_endereco: string;
  for_numero: string;
  for_complemento: string;
  for_bairro: string;
  for_cidade: string;
  for_estado: string;
  for_pais: string;
  for_codpais: string;
  for_praca: string;
  for_praca_uf: string;
  for_telefone: string;
  for_email: string;
  for_contato: string;
  for_fax: string;
  for_fiscal: string;
  for_produtor: 'S' | 'N';
  for_contactb: string;
  for_serie: string;
  for_obs: string;
}
