import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showBack = false;
  @Input() cartCount = 0;
  @Input() showCart = false;

  @Output() backClick  = new EventEmitter<void>();
  @Output() cartClick  = new EventEmitter<void>();
}
