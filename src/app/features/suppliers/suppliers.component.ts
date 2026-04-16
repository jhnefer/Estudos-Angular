import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';
import { InputMaskModule } from 'primeng/inputmask';
import { SupplierService } from '../../core/services';
import { Supplier } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-suppliers',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TableModule, 
    InputTextModule, 
    DialogModule, 
    ButtonModule, 
    MessageModule, 
    SelectModule, 
    IconField, 
    InputIcon,
    TextareaModule,
    TabsModule,
    InputMaskModule
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent {
  private fb = inject(FormBuilder);
  private supplierService = inject(SupplierService);

  searchControl = new FormControl('');
  
  supplierForm = this.fb.nonNullable.group({
    for_codigo: [0],
    for_nome: ['', [Validators.required, Validators.maxLength(45)]],
    for_fantasia: ['', [Validators.required, Validators.maxLength(20)]],
    for_cnpj: ['', [Validators.required, Validators.maxLength(18)]],
    for_ie: ['', [Validators.required, Validators.maxLength(15)]],
    for_tipo: ['G', [Validators.required]],
    for_cep: ['', [Validators.required, Validators.maxLength(9)]],
    for_endereco: ['', [Validators.required, Validators.maxLength(45)]],
    for_numero: ['', [Validators.required, Validators.maxLength(5)]],
    for_complemento: ['', [Validators.required, Validators.maxLength(30)]],
    for_bairro: ['', [Validators.required, Validators.maxLength(20)]],
    for_cidade: ['', [Validators.required, Validators.maxLength(30)]],
    for_estado: ['', [Validators.required, Validators.maxLength(2)]],
    for_pais: ['Brasil', [Validators.required, Validators.maxLength(30)]],
    for_codpais: ['1058', [Validators.required, Validators.maxLength(4)]],
    for_praca: ['', [Validators.required, Validators.maxLength(30)]],
    for_praca_uf: ['', [Validators.required, Validators.maxLength(2)]],
    for_telefone: ['', [Validators.required, Validators.maxLength(14)]],
    for_email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    for_contato: ['', [Validators.required, Validators.maxLength(30)]],
    for_fax: ['', [Validators.required, Validators.maxLength(14)]],
    for_fiscal: ['', [Validators.required, Validators.maxLength(2)]],
    for_produtor: ['N', [Validators.required]],
    for_contactb: ['', [Validators.required, Validators.maxLength(6)]],
    for_serie: ['', [Validators.required, Validators.maxLength(3)]],
    for_obs: ['', [Validators.required, Validators.maxLength(55)]]
  });
  
  dialogOpen = false;
  editingSupplier = signal<Supplier | null>(null);
  errorMessage = signal<string | null>(null);

  allSuppliers = this.supplierService.suppliers;

  states = [
    { label: 'SP', value: 'SP' }, { label: 'RJ', value: 'RJ' }, { label: 'MG', value: 'MG' },
    { label: 'ES', value: 'ES' }, { label: 'PR', value: 'PR' }, { label: 'SC', value: 'SC' },
    { label: 'RS', value: 'RS' }, { label: 'MS', value: 'MS' }, { label: 'MT', value: 'MT' },
    { label: 'GO', value: 'GO' }, { label: 'DF', value: 'DF' }, { label: 'BA', value: 'BA' },
    { label: 'SE', value: 'SE' }, { label: 'AL', value: 'AL' }, { label: 'PE', value: 'PE' },
    { label: 'PB', value: 'PB' }, { label: 'RN', value: 'RN' }, { label: 'CE', value: 'CE' },
    { label: 'PI', value: 'PI' }, { label: 'MA', value: 'MA' }, { label: 'PA', value: 'PA' },
    { label: 'AP', value: 'AP' }, { label: 'AM', value: 'AM' }, { label: 'RR', value: 'RR' },
    { label: 'AC', value: 'AC' }, { label: 'RO', value: 'RO' }, { label: 'TO', value: 'TO' }
  ];

  types = [
    { label: 'Geral', value: 'G' },
    { label: 'Serviços', value: 'S' },
    { label: 'Matéria-Prima', value: 'M' }
  ];

  produtorOptions = [
    { label: 'Sim', value: 'S' },
    { label: 'Não', value: 'N' }
  ];

  filteredSuppliers = computed(() => {
    const searchTerm = (this.searchControl.value || '').toLowerCase();
    const suppliers = this.allSuppliers();
    
    return searchTerm
      ? suppliers.filter(s =>
          s.for_nome.toLowerCase().includes(searchTerm) ||
          s.for_cnpj.includes(searchTerm) ||
          (s.for_fantasia && s.for_fantasia.toLowerCase().includes(searchTerm))
        )
      : suppliers;
  });

  get dialogTitle() {
    return this.editingSupplier() ? 'Editar Fornecedor' : 'Novo Fornecedor';
  }

  openNewSupplier() {
    this.editingSupplier.set(null);
    this.supplierForm.reset({
      for_codigo: 0,
      for_tipo: 'G',
      for_pais: 'Brasil',
      for_codpais: '1058',
      for_produtor: 'N'
    });
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  openEditSupplier(supplier: Supplier) {
    this.editingSupplier.set(supplier);
    this.supplierForm.patchValue(supplier);
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  saveSupplier() {
    if (this.supplierForm.invalid) {
      this.errorMessage.set('Por favor, preencha os campos obrigatórios corretamente.');
      this.supplierForm.markAllAsTouched();
      return;
    }

    const supplierData = this.supplierForm.getRawValue();
    const isNew = !this.editingSupplier();

    if (isNew) {
      const nextId = Math.max(...this.allSuppliers().map(s => s.for_codigo), 0) + 1;
      this.supplierService.addSupplier({ ...supplierData, for_codigo: nextId });
    } else {
      this.supplierService.updateSupplier(supplierData);
    }

    this.closeDialog();
  }

  deleteSupplier(supplier: Supplier) {
    if (!window.confirm(`Deseja realmente excluir o fornecedor ${supplier.for_nome}?`)) {
      return;
    }
    this.supplierService.deleteSupplier(supplier.for_codigo);
  }

  closeDialog() {
    this.dialogOpen = false;
    this.editingSupplier.set(null);
    this.errorMessage.set(null);
    this.supplierForm.reset();
  }
}
