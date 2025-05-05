import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-overlay-loading',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './overlay-loading.component.html',
  styleUrl: './overlay-loading.component.scss',
})
export class OverlayLoadingComponent {
  readonly dialogRef = inject(MatDialogRef<OverlayLoadingComponent>);
}
