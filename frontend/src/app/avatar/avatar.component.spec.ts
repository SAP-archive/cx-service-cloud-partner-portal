import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';
import { AbbreviatePipeModule } from '../abbreviate-pipe-module/abbreviate-pipe.module';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      imports: [AbbreviatePipeModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.nativeElement.querySelector('div').innerText).toEqual('--');

    component.text = 'A Company Ltd.';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div').innerText).toEqual('AC');
  });
});
