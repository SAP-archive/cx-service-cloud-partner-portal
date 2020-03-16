import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const modules = [
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [modules],
  exports: [modules],
})
export class AuthMaterialModule {
}
