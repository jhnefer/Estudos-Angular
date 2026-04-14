import { Injectable, signal } from '@angular/core';
import { Customer } from '../../shared/models/customer.model';

const createMockCustomer = (data: Partial<Customer>): Customer => ({
  cli_codigo: 0,
  cli_nome: "",
  cli_fantasia: "",
  cli_endereco: "",
  cli_numero: "",
  cli_complemento: "",
  cli_bairro: "",
  cli_cidade: "",
  cli_codcidade: "",
  cli_estado: "",
  cli_codpais: "1058",
  cli_pais: "BRASIL",
  cli_telefone: "",
  cli_fax: "",
  cli_cep: "",
  cli_cnpj: "",
  cli_ie: "",
  cli_serie: "",
  cli_praca: "",
  cli_praca_uf: "",
  cli_contato: "",
  cli_fiscal: 0,
  cli_tipo: "J",
  cli_especie: "",
  cli_pgs_fil: 0,
  cli_pgs_cod: 0,
  cli_pgs_estab: 0,
  cli_peso_qual: "",
  cli_cst: "",
  cli_cfop: "",
  cli_email: "",
  cli_contactb: "",
  cli_terminal: 0,
  cli_transportadora: "",
  cli_frete: "C",
  cli_placa: "",
  cli_ufplaca: "",
  cli_tr_cnpj: "",
  cli_tr_endereco: "",
  cli_tr_cidade: "",
  cli_tr_uf: "",
  cli_tr_ie: "",
  cli_tr_observacao: "",
  cli_tr_pedagio: "",
  cli_produtor: "N",
  cli_comissao: 0,
  cli_condpagto: 0,
  ...data
});

const initialCustomers: Customer[] = [
  createMockCustomer({ cli_codigo: 1, cli_nome: "Norsul Navegação Ltda", cli_fantasia: "NORSUL", cli_cnpj: "12.345.678/0001-90", cli_cidade: "Rio de Janeiro", cli_estado: "RJ", cli_telefone: "(21) 3456-7890", cli_email: "compras@norsul.com.br", cli_contato: "Carlos Mendes", cli_endereco: "Av. Rio Branco", cli_numero: "123", cli_bairro: "Centro", cli_cep: "20040-009", cli_ie: "12.345.678", cli_transportadora: "Trans Porto" }),
  createMockCustomer({ cli_codigo: 2, cli_nome: "Aliança Navegação e Logística", cli_fantasia: "ALIANÇA", cli_cnpj: "23.456.789/0001-01", cli_cidade: "Santos", cli_estado: "SP", cli_telefone: "(13) 2345-6789", cli_email: "suprimentos@alianca.com", cli_contato: "Ana Souza", cli_endereco: "Rua do Porto", cli_numero: "456", cli_bairro: "Paquetá", cli_cep: "11013-001", cli_ie: "23.456.789", cli_transportadora: "Log Express" }),
  createMockCustomer({ cli_codigo: 3, cli_nome: "Empresa de Navegação Elcano", cli_fantasia: "ELCANO", cli_cnpj: "34.567.890/0001-12", cli_cidade: "Paranaguá", cli_estado: "PR", cli_telefone: "(41) 3456-1234", cli_email: "operacoes@elcano.com.br", cli_contato: "Roberto Lima", cli_endereco: "Av. Beira Mar", cli_numero: "789", cli_bairro: "Porto", cli_cep: "83203-000", cli_ie: "34.567.890" }),
  createMockCustomer({ cli_codigo: 4, cli_nome: "Log-In Logística Intermodal", cli_fantasia: "LOG-IN", cli_cnpj: "45.678.901/0001-23", cli_cidade: "Vitória", cli_estado: "ES", cli_telefone: "(27) 4567-8901", cli_email: "logistica@login.com.br", cli_contato: "Fernanda Costa", cli_endereco: "Rod. Norte Sul", cli_numero: "1000", cli_bairro: "Industrial", cli_cep: "29161-500", cli_ie: "45.678.901", cli_transportadora: "Rodo Mar" }),
  createMockCustomer({ cli_codigo: 5, cli_nome: "Wilson Sons Estaleiros", cli_fantasia: "WILSON SONS", cli_cnpj: "56.789.012/0001-34", cli_cidade: "Guarujá", cli_estado: "SP", cli_telefone: "(13) 5678-9012", cli_email: "estaleiro@wilsonsons.com", cli_contato: "Marcos Alves", cli_endereco: "Av. Santos Dumont", cli_numero: "2000", cli_bairro: "Vicente de Carvalho", cli_cep: "11450-000", cli_ie: "56.789.012" }),
];

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly _customers = signal<Customer[]>(initialCustomers);
  readonly customers = this._customers.asReadonly();

  addCustomer(customer: Customer) {
    this._customers.update(customers => [...customers, customer]);
  }

  updateCustomer(customer: Customer) {
    this._customers.update(customers => customers.map(item => (item.cli_codigo === customer.cli_codigo ? customer : item)));
  }

  deleteCustomer(codigo: number) {
    this._customers.update(customers => customers.filter(c => c.cli_codigo !== codigo));
  }
}
