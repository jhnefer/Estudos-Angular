import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemLista } from './itemlista';
  
@Component({
  selector: 'app-lista-compras',
  imports: [FormsModule],
  templateUrl: './lista-compras.html',
  styleUrl: './lista-compras.css',
})
export class ListaCompras {
  item:string = '';
  lista: ItemLista[] = [];

  adicionarItem() {
    let itemLista: ItemLista = new ItemLista(); // let é usado para criar uma variável local dentro do método
    itemLista.nome = this.item; // atribui o valor do campo de texto à propriedade nome do itemLista
    itemLista.id = this.lista.length + 1; // atribui um id único ao item, baseado no tamanho da lista
    this.lista.push(itemLista); // adiciona o item à lista
    this.item = ''; // Limpa o campo após adicionar o item

    console.table(this.lista); // Exibe a lista atualizada no console para verificação
  }

}
