import { Component, EventEmitter, Output,Input } from '@angular/core';
import { RouterLink,RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  @Output() search_Item = new EventEmitter();
  @Input() totalOrders: number = 0; 

  search: string = '';
  constructor () {

  }

  ngOnInit(): void {

  }

  searchItems(): void {
    console.log(this.search);
    this.search_Item.emit(this.search);
  }
}
