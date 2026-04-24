import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TabsModule } from 'primeng/tabs';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmationService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ProductService, SupplierService, SupplierProductService } from '../../core/services';
import { Product, SupplierProduct } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TableModule, 
    InputTextModule, 
    InputNumberModule,
    DialogModule, 
    ButtonModule, 
    MessageModule, 
    SelectModule, 
    IconField, 
    InputIcon,
    TabsModule,
    DatePickerModule,
    DividerModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  private fb = inject(FormBuilder);
  public productService = inject(ProductService);
  public supplierService = inject(SupplierService);
  public supplierProductService = inject(SupplierProductService);
  private confirmationService = inject(ConfirmationService);

  searchControl = new FormControl('');
  
  private searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith('')),
    { initialValue: '' }
  );

  productForm = this.fb.nonNullable.group({
    pr_codigo: ['', [Validators.required]],
    pr_tp: ['', [Validators.required]],
    pr_descricao: ['', [Validators.required]],
    pr_description: [''],
    pr_prefixo: [''],
    pr_numero: [''],
    pr_extensao: [''],
    pr_codbarra: [''],
    pr_barrateste: [''],
    pr_classif: [''],
    pr_grupo: [null as number | null],
    pr_marca: [''],
    pr_especie: [''],
    pr_tipo: [''],
    pr_ativo: ['SIM'],
    pr_estoque: ['SIM'],
    pr_unidade: ['UN'],
    pr_segum: [''],
    pr_conversao: [1],
    pr_fator: [1],
    pr_valorvenda: [0],
    pr_custo: [0],
    pr_custo2: [0],
    pr_custo3: [0],
    pr_cst: [''],
    pr_cfop: [''],
    pr_percicms: [0],
    pr_reduicms: [0],
    pr_numerario: [''],
    pr_almoxarifado: [null as number | null],
    pr_regiao: [null as number | null],
    pr_minimo: [0],
    pr_edicao: [null as Date | null],
    pr_edi: [''],
    pr_codprogress: [null as number | null],
    pr_impa: [''],
    pr_issa: ['']
  });

  supplierProductForm = this.fb.nonNullable.group({
    for_codigo: [null as number | null, [Validators.required]],
    cod_prod_forn: ['', [Validators.required]],
    cod_cli_forn: [''],
    unidade_compra: ['CX', [Validators.required]],
    fator_conversao: [1.000, [Validators.required, Validators.min(0.001)]]
  });
  
  localSupplierProducts = signal<SupplierProduct[]>([]);
  
  dialogOpen = false;
  editingProduct = signal<Product | null>(null);
  errorMessage = signal<string | null>(null);

  statusOptions = [
    { label: 'Sim', value: 'SIM' },
    { label: 'Não', value: 'NAO' }
  ];

  filteredProducts = computed(() => {
    const term = (this.searchTerm() || '').toLowerCase();
    const products = this.productService.products();
    return term
      ? products.filter(p =>
          p.pr_descricao?.toLowerCase().includes(term) ||
          p.pr_codigo.toLowerCase().includes(term) ||
          p.pr_codbarra?.includes(term)
        )
      : products;
  });

  get dialogTitle() {
    return this.editingProduct() 
      ? `Editar: ${this.editingProduct()?.pr_descricao}` 
      : 'Novo Produto';
  }

  openNewProduct() {
    this.editingProduct.set(null);
    this.localSupplierProducts.set([]);
    this.productForm.reset({
      pr_ativo: 'SIM',
      pr_estoque: 'SIM',
      pr_unidade: 'UN',
      pr_conversao: 1,
      pr_fator: 1,
      pr_valorvenda: 0,
      pr_custo: 0,
      pr_custo2: 0,
      pr_custo3: 0,
      pr_percicms: 0,
      pr_reduicms: 0,
      pr_minimo: 0
    });
    this.productForm.get('pr_codigo')?.enable();
    this.productForm.get('pr_tp')?.enable();
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  openEditProduct(product: Product) {
    this.editingProduct.set(product);
    this.productForm.patchValue(product as any);
    this.productForm.get('pr_codigo')?.disable();
    this.productForm.get('pr_tp')?.disable();
    
    const existing = this.supplierProductService.supplierProducts().filter(
      sp => sp.pr_codigo === product.pr_codigo && sp.pr_tp === product.pr_tp
    );
    this.localSupplierProducts.set([...existing]);
    
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios.');
      this.productForm.markAllAsTouched();
      return;
    }

    const productData = this.productForm.getRawValue() as Product;
    const isNewProduct = !this.editingProduct();

    if (!isNewProduct) {
      this.productService.updateProduct(productData.pr_codigo, productData.pr_tp, productData);
    } else {
      this.productService.addProduct(productData);
    }

    this.syncSuppliers(productData.pr_codigo, productData.pr_tp);
    this.closeDialog();
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o produto ${product.pr_descricao}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productService.deleteProduct(product.pr_codigo, product.pr_tp);
      }
    });
  }

  private syncSuppliers(pr_codigo: string, pr_tp: string) {
    const allSP = this.supplierProductService.supplierProducts();
    
    this.localSupplierProducts().forEach(sp => {
      const exists = allSP.some(item => 
        item.for_codigo === sp.for_codigo && 
        item.pr_codigo === pr_codigo && 
        item.pr_tp === pr_tp
      );
      if (!exists) {
        this.supplierProductService.addSupplierProduct({ ...sp, pr_codigo, pr_tp });
      }
    });
  }

  addSupplierToProduct() {
    if (this.supplierProductForm.invalid) return;

    const formValue = this.supplierProductForm.getRawValue();
    const productCode = this.productForm.get('pr_codigo')?.value || '';
    const productTp = this.productForm.get('pr_tp')?.value || '';
    
    const supplier = this.supplierService.suppliers().find(s => s.for_codigo === formValue.for_codigo);
    if (!supplier) return;

    const newSupplierProduct: SupplierProduct = {
      for_codigo: supplier.for_codigo.toString(),
      for_nome: supplier.for_nome,
      pr_codigo: productCode,
      pr_tp: productTp,
      cod_prod_forn: formValue.cod_prod_forn,
      cod_cli_forn: formValue.cod_cli_forn || '',
      unidade_compra: formValue.unidade_compra,
      fator_conversao: formValue.fator_conversao || 1
    };

    this.localSupplierProducts.update(prev => [...prev, newSupplierProduct]);
    
    this.supplierProductForm.reset({ 
      for_codigo: null,
      unidade_compra: 'CX', 
      fator_conversao: 1.000 
    });
  }

  removeSupplier(sp: SupplierProduct) {
    this.localSupplierProducts.update(prev => 
      prev.filter(item => item.for_codigo !== sp.for_codigo)
    );
    
    if (this.editingProduct()) {
      this.supplierProductService.removeSupplierProduct(sp.for_codigo, sp.pr_codigo, sp.pr_tp);
    }
  }

  closeDialog() {
    this.dialogOpen = false;
    this.editingProduct.set(null);
    this.errorMessage.set(null);
    this.productForm.reset();
    this.supplierProductForm.reset();
  }
}
