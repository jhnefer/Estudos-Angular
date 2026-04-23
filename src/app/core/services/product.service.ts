import { Injectable, signal } from '@angular/core';
import { Product } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();

  constructor() {
    // Dados iniciais para teste
    this._products.set([
      {
        pr_codigo: '001',
        pr_tp: 'PA',
        pr_descricao: 'Produto Exemplo 1',
        pr_valorvenda: 150.00,
        pr_ativo: 'SIM',
        pr_estoque: 'SIM'
      },
      {
        pr_codigo: '002',
        pr_tp: 'MP',
        pr_descricao: 'Matéria Prima X',
        pr_valorvenda: 0.00,
        pr_ativo: 'SIM',
        pr_estoque: 'SIM'
      }
    ]);
  }

  addProduct(product: Product) {
    this._products.update(prev => [...prev, product]);
  }

  updateProduct(codigo: string, tp: string, updatedProduct: Product) {
    this._products.update(prev => 
      prev.map(p => (p.pr_codigo === codigo && p.pr_tp === tp) ? updatedProduct : p)
    );
  }

  deleteProduct(codigo: string, tp: string) {
    this._products.update(prev => 
      prev.filter(p => !(p.pr_codigo === codigo && p.pr_tp === tp))
    );
  }

  getProductById(codigo: string, tp: string): Product | undefined {
    return this._products().find(p => p.pr_codigo === codigo && p.pr_tp === tp);
  }
}
