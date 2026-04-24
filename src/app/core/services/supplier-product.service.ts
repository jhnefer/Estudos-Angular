import { Injectable, signal } from '@angular/core';
import { SupplierProduct } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class SupplierProductService {
  private readonly _supplierProducts = signal<SupplierProduct[]>([]);
  readonly supplierProducts = this._supplierProducts.asReadonly();

  constructor() {
    // Dados iniciais para demonstração
    this._supplierProducts.set([
      {
        for_codigo: 'F001',
        for_nome: 'Fornecedor de Metais LTDA',
        pr_codigo: '001',
        pr_tp: 'PA',
        cod_prod_forn: 'MET-9982',
        cod_cli_forn: 'CLI-77',
        unidade_compra: 'CX',
        fator_conversao: 12,
        preco_ultima_compra: 145.50,
        data_ultima_compra: new Date()
      }
    ]);
  }

  getSuppliersByProduct(pr_codigo: string, pr_tp: string) {
    return this._supplierProducts().filter(
      sp => sp.pr_codigo === pr_codigo && sp.pr_tp === pr_tp
    );
  }

  addSupplierProduct(supplierProduct: SupplierProduct) {
    this._supplierProducts.update(prev => [...prev, supplierProduct]);
  }

  removeSupplierProduct(for_codigo: string, pr_codigo: string, pr_tp: string) {
    this._supplierProducts.update(prev => 
      prev.filter(sp => !(sp.for_codigo === for_codigo && sp.pr_codigo === pr_codigo && sp.pr_tp === pr_tp))
    );
  }
}
