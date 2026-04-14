import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { CustomerService } from '../../core/services';
import { Customer } from '../../shared/models';

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
  private customerService = inject(CustomerService);

  searchControl = new FormControl('');
  customerForm: FormGroup;
  
  dialogOpen = false;
  editingCustomer = signal<Customer | null>(null);
  errorMessage = signal<string | null>(null);

  tiposCliente = [
    { label: 'Jurídica', value: 'J' },
    { label: 'Física', value: 'F' }
  ];

  opcoesFrete = [
    { label: 'CIF ', value: 'C' },
    { label: 'FOB ', value: 'F' }
  ];

  get allCustomers() {
    return this.customerService.customers;
  }

  constructor() {
    this.customerForm = this.fb.group({
      // ABA 1: Identificação
      cli_codigo: [{ value: null, disabled: true }],
      cli_nome: ['', [Validators.required]],
      cli_fantasia: ['', [Validators.required]],
      cli_cnpj: ['', [Validators.required]],
      cli_ie: [''],
      cli_contato: [''],
      cli_email: ['', [Validators.email]],
      cli_telefone: [''],
      cli_fax: [''],
      cli_tipo: ['J'],
      cli_produtor: ['N'],

      // ABA 2: Localização
      cli_cep: ['', [Validators.required]],
      cli_endereco: ['', [Validators.required]],
      cli_numero: ['', [Validators.required]],
      cli_complemento: [''],
      cli_bairro: ['', [Validators.required]],
      cli_cidade: ['', [Validators.required]],
      cli_codcidade: [''],
      cli_estado: ['', [Validators.required]],
      cli_pais: ['BRASIL'],
      cli_codpais: ['1058'],

      // ABA 3: Fiscal / Financeiro
      cli_cfop: [''],
      cli_cst: [''],
      cli_serie: [''],
      cli_especie: [''],
      cli_fiscal: [0],
      cli_comissao: [0],
      cli_condpagto: [null],
      cli_praca: [''],
      cli_praca_uf: [''],
      cli_contactb: [''],
      cli_peso_qual: [''],

      // ABA 4: Logística / Transportadora
      cli_transportadora: [''],
      cli_frete: ['C'],
      cli_placa: [''],
      cli_ufplaca: [''],
      cli_tr_cnpj: [''],
      cli_tr_endereco: [''],
      cli_tr_cidade: [''],
      cli_tr_uf: [''],
      cli_tr_ie: [''],
      cli_tr_pedagio: [''],
      cli_tr_observacao: [''],
      cli_terminal: [null],
      cli_pgs_fil: [0],
      cli_pgs_cod: [0],
      cli_pgs_estab: [0]
    });
  }

  get filteredCustomers() {
    const searchTerm = (this.searchControl.value || '').toLowerCase();
    return searchTerm
      ? this.allCustomers().filter(c =>
          c.cli_nome.toLowerCase().includes(searchTerm) ||
          c.cli_fantasia.toLowerCase().includes(searchTerm) ||
          c.cli_cnpj.includes(searchTerm)
        )
      : this.allCustomers();
  }

  get dialogTitle() {
    return this.editingCustomer() ? `Editar: ${this.editingCustomer()?.cli_fantasia}` : 'Novo Cliente';
  }

  openNewCustomer() {
    this.editingCustomer.set(null);
    const nextId = Math.max(...this.allCustomers().map(c => c.cli_codigo), 0) + 1;
    
    this.customerForm.reset({
      cli_codigo: nextId,
      cli_tipo: 'J',
      cli_frete: 'C',
      cli_pais: 'BRASIL',
      cli_codpais: '1058',
      cli_produtor: 'N'
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

    // Como cli_codigo está desabilitado, precisamos pegar o valor via getRawValue()
    const customerData = this.customerForm.getRawValue();
    const isNewCustomer = !this.editingCustomer();

    if (!isNewCustomer) {
      this.customerService.updateCustomer(customerData);
    } else {
      this.customerService.addCustomer(customerData);
    }

    this.closeDialog();
  }

  deleteCustomer(customer: Customer) {
    if (!window.confirm(`Deseja realmente excluir ${customer.cli_nome}?`)) return;
    this.customerService.deleteCustomer(customer.cli_codigo);
  }

  closeDialog() {
    this.dialogOpen = false;
    this.editingCustomer.set(null);
    this.errorMessage.set(null);
    this.customerForm.reset();
  }
}
