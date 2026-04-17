import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SupplierService } from '../../core/services';
import { Supplier } from '../../shared/models';
import { COUNTRY, PRODUCER_TYPE, SUPPLIER_TYPE } from '../../shared/constants/domain.constants';

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
    InputMaskModule,
    ConfirmDialogModule
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent {
  private fb = inject(FormBuilder);
  public supplierService = inject(SupplierService);
  private confirmationService = inject(ConfirmationService);

  searchControl = new FormControl('');
  
  private searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith('')),
    { initialValue: '' }
  );

  supplierForm = this.fb.nonNullable.group({
    for_codigo: [0],
    for_nome: ['', [Validators.required, Validators.maxLength(45)]],
    for_fantasia: ['', [Validators.required, Validators.maxLength(20)]],
    for_cnpj: ['', [Validators.required, Validators.maxLength(18)]],
    for_ie: ['', [Validators.required, Validators.maxLength(15)]],
    for_tipo: [SUPPLIER_TYPE.GENERAL as Supplier['for_tipo'], [Validators.required]],
    for_cep: ['', [Validators.required, Validators.maxLength(9)]],
    for_endereco: ['', [Validators.required, Validators.maxLength(45)]],
    for_numero: ['', [Validators.required, Validators.maxLength(5)]],
    for_complemento: ['', [Validators.maxLength(30)]],
    for_bairro: ['', [Validators.required, Validators.maxLength(20)]],
    for_cidade: ['', [Validators.required, Validators.maxLength(30)]],
    for_estado: ['', [Validators.required, Validators.maxLength(2)]],
    for_pais: [COUNTRY.BRAZIL_NAME as string, [Validators.required, Validators.maxLength(30)]],
    for_codpais: [COUNTRY.BRAZIL_CODE as string, [Validators.required, Validators.maxLength(4)]],
    for_praca: ['', [Validators.required, Validators.maxLength(30)]],
    for_praca_uf: ['', [Validators.required, Validators.maxLength(2)]],
    for_telefone: ['', [Validators.required, Validators.maxLength(14)]],
    for_email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    for_contato: ['', [Validators.required, Validators.maxLength(30)]],
    for_fax: ['', [Validators.maxLength(14)]],
    for_fiscal: ['', [Validators.required, Validators.maxLength(2)]],
    for_produtor: [PRODUCER_TYPE.NO as Supplier['for_produtor'], [Validators.required]],
    for_contactb: ['', [Validators.required, Validators.maxLength(6)]],
    for_serie: ['', [Validators.required, Validators.maxLength(3)]],
    for_obs: ['', [Validators.maxLength(55)]]
  });
  
  dialogOpen = false;
  editingSupplier = signal<Supplier | null>(null);
  errorMessage = signal<string | null>(null);

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
    { label: 'Geral', value: SUPPLIER_TYPE.GENERAL },
    { label: 'Serviços', value: SUPPLIER_TYPE.SERVICES },
    { label: 'Matéria-Prima', value: SUPPLIER_TYPE.RAW_MATERIAL }
  ];

  produtorOptions = [
    { label: 'Sim', value: PRODUCER_TYPE.YES },
    { label: 'Não', value: PRODUCER_TYPE.NO }
  ];

  filteredSuppliers = computed(() => {
    const term = (this.searchTerm() || '').toLowerCase();
    const suppliers = this.supplierService.suppliers();
    
    return term
      ? suppliers.filter(s =>
          s.for_nome.toLowerCase().includes(term) ||
          s.for_cnpj.includes(term) ||
          (s.for_fantasia && s.for_fantasia.toLowerCase().includes(term))
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
      for_tipo: SUPPLIER_TYPE.GENERAL,
      for_pais: COUNTRY.BRAZIL_NAME,
      for_codpais: COUNTRY.BRAZIL_CODE,
      for_produtor: PRODUCER_TYPE.NO
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

    const supplierData = this.supplierForm.getRawValue() as Supplier;
    const isNew = !this.editingSupplier();

    if (isNew) {
      const nextId = Math.max(...this.supplierService.suppliers().map(s => s.for_codigo), 0) + 1;
      this.supplierService.addSupplier({ ...supplierData, for_codigo: nextId });
    } else {
      this.supplierService.updateSupplier(supplierData);
    }

    this.closeDialog();
  }

  deleteSupplier(supplier: Supplier) {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o fornecedor ${supplier.for_nome}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.supplierService.deleteSupplier(supplier.for_codigo);
      }
    });
  }

  closeDialog() {
    this.dialogOpen = false;
    this.editingSupplier.set(null);
    this.errorMessage.set(null);
    this.supplierForm.reset();
  }
}
