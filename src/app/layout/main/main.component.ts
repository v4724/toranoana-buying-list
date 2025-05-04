import { Component } from '@angular/core';
import { TableComponent } from "../../shared/table/table.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
