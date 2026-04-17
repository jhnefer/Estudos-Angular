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
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CustomerService } from '../../core/services';
import { Customer } from '../../shared/models';
import { COUNTRY, CUSTOMER_TYPE, FREIGHT_TYPE, PRODUCER_TYPE } from '../../shared/constants/domain.constants';

@Component({
  standalone: true,
  selector: 'app-customers',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TableModule, 
    InputTextModule, 
    TextareaModule,
    DialogModule, 
    ButtonModule, 
    MessageModule, 
    SelectModule, 
    IconField, 
    InputIcon,
    TabsModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  private fb = inject(FormBuilder);
  public customerService = inject(CustomerService);
  private confirmationService = inject(ConfirmationService);

  searchControl = new FormControl('');
  
  private searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith('')),
    { initialValue: '' }
  );

  customerForm = this.fb.nonNullable.group({
    // ABA 1: Identificação
    cli_codigo: [{ value: 0, disabled: true }],
    cli_nome: ['', [Validators.required]],
    cli_fantasia: ['', [Validators.required]],
    cli_cnpj: ['', [Validators.required]],
    cli_ie: [''],
    cli_contato: [''],
    cli_email: ['', [Validators.email]],
    cli_telefone: [''],
    cli_fax: [''],
    cli_tipo: [CUSTOMER_TYPE.JURIDICAL as Customer['cli_tipo']],
    cli_produtor: [PRODUCER_TYPE.NO as Customer['cli_produtor']],

    // ABA 2: Localização
    cli_cep: ['', [Validators.required]],
    cli_endereco: ['', [Validators.required]],
    cli_numero: ['', [Validators.required]],
    cli_complemento: [''],
    cli_bairro: ['', [Validators.required]],
    cli_cidade: ['', [Validators.required]],
    cli_codcidade: [''],
    cli_estado: ['', [Validators.required]],
    cli_pais: [COUNTRY.BRAZIL_NAME as string],
    cli_codpais: [COUNTRY.BRAZIL_CODE as string],

    // ABA 3: Fiscal / Financeiro
    cli_cfop: [''],
    cli_cst: [''],
    cli_serie: [''],
    cli_especie: [''],
    cli_fiscal: [0],
    cli_comissao: [0],
    cli_condpagto: [null as number | null],
    cli_praca: [''],
    cli_praca_uf: [''],
    cli_contactb: [''],
    cli_peso_qual: [''],

    // ABA 4: Logística / Transportadora
    cli_transportadora: [''],
    cli_frete: [FREIGHT_TYPE.CIF as Customer['cli_frete']],
    cli_placa: [''],
    cli_ufplaca: [''],
    cli_tr_cnpj: [''],
    cli_tr_endereco: [''],
    cli_tr_cidade: [''],
    cli_tr_uf: [''],
    cli_tr_ie: [''],
    cli_tr_pedagio: [''],
    cli_tr_observacao: [''],
    cli_terminal: [0],
    cli_pgs_fil: [0],
    cli_pgs_cod: [0],
    cli_pgs_estab: [0]
  });
  
  dialogOpen = false;
  editingCustomer = signal<Customer | null>(null);
  errorMessage = signal<string | null>(null);

  tiposCliente = [
    { label: 'Jurídica', value: CUSTOMER_TYPE.JURIDICAL },
    { label: 'Física', value: CUSTOMER_TYPE.PHYSICAL }
  ];

  opcoesFrete = [
    { label: 'CIF ', value: FREIGHT_TYPE.CIF },
    { label: 'FOB ', value: FREIGHT_TYPE.FOB }
  ];

  filteredCustomers = computed(() => {
    const term = (this.searchTerm() || '').toLowerCase();
    const customers = this.customerService.customers();
    return term
      ? customers.filter(c =>
          c.cli_nome.toLowerCase().includes(term) ||
          c.cli_fantasia.toLowerCase().includes(term) ||
          c.cli_cnpj.includes(term)
        )
      : customers;
  });

  get dialogTitle() {
    return this.editingCustomer() ? `Editar: ${this.editingCustomer()?.cli_fantasia}` : 'Novo Cliente';
  }

  openNewCustomer() {
    this.editingCustomer.set(null);
    const nextId = Math.max(...this.customerService.customers().map(c => c.cli_codigo), 0) + 1;
    
    this.customerForm.reset({
      cli_codigo: nextId,
      cli_tipo: CUSTOMER_TYPE.JURIDICAL,
      cli_frete: FREIGHT_TYPE.CIF,
      cli_pais: COUNTRY.BRAZIL_NAME,
      cli_codpais: COUNTRY.BRAZIL_CODE,
      cli_produtor: PRODUCER_TYPE.NO
    });
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  openEditCustomer(customer: Customer) {
    this.editingCustomer.set(customer);
    this.customerForm.patchValue(customer);
    this.errorMessage.set(null);
    this.dialogOpen = true;
  }

  saveCustomer() {
    if (this.customerForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos obrigatórios.');
      this.customerForm.markAllAsTouched();
      return;
    }

    const customerData = this.customerForm.getRawValue() as Customer;
    const isNewCustomer = !this.editingCustomer();

    if (!isNewCustomer) {
      this.customerService.updateCustomer(customerData);
    } else {
      this.customerService.addCustomer(customerData);
    }

    this.closeDialog();
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir ${customer.cli_nome}?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.customerService.deleteCustomer(customer.cli_codigo);
      }
    });
  }

  closeDialog() {
    this.dialogOpen = false;
    this.editingCustomer.set(null);
    this.errorMessage.set(null);
    this.customerForm.reset();
  }
}
