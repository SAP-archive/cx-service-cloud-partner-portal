import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FakeDataComponent } from './components/fake-data/fake-data.component';
import { translateModule } from '../utils/translate.module';

@NgModule({
  imports: [
    CommonModule,
    translateModule,
  ],
  declarations: [
    FakeDataComponent,
  ],
  exports: [
    FakeDataComponent,
  ],
  providers: [],
})
export class FakeDataModule {
}

export { FakeDataComponent } from './components/fake-data/fake-data.component';
