import { Injectable, signal } from '@angular/core';
import { Supplier } from '../../shared/models/supplier.model';

const initialSuppliers: Supplier[] = [
  {
    for_codigo: 1,
    for_nome: 'Suprimentos Marítimos S.A.',
    for_fantasia: 'Marítima Suprimentos',
    for_cnpj: '12.345.678/0001-90',
    for_ie: '123456789',
    for_tipo: 'G',
    for_cep: '11010-000',
    for_endereco: 'Av. Portuária',
    for_numero: '500',
    for_complemento: 'Armazém 4',
    for_bairro: 'Porto',
    for_cidade: 'Santos',
    for_estado: 'SP',
    for_pais: 'Brasil',
    for_codpais: '1058',
    for_praca: 'Santos',
    for_praca_uf: 'SP',
    for_telefone: '(13) 3211-4000',
    for_email: 'contato@maritima.com.br',
    for_contato: 'João Silva',
    for_fax: '',
    for_fiscal: '01',
    for_produtor: 'N',
    for_contactb: '100101',
    for_serie: '001',
    for_obs: 'Fornecedor principal de peças.'
  }
];

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private readonly _suppliers = signal<Supplier[]>(initialSuppliers);
  readonly suppliers = this._suppliers.asReadonly();

  getSuppliers() {
    return this._suppliers();
  }

  addSupplier(supplier: Supplier) {
    this._suppliers.update(suppliers => [...suppliers, supplier]);
  }

  updateSupplier(supplier: Supplier) {
    this._suppliers.update(suppliers => 
      suppliers.map(item => (item.for_codigo === supplier.for_codigo ? supplier : item))
    );
  }

  deleteSupplier(id: number) {
    this._suppliers.update(suppliers => 
      suppliers.filter(supplier => supplier.for_codigo !== id)
    );
  }
}
