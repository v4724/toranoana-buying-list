import { Component } from '@angular/core';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MainComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
