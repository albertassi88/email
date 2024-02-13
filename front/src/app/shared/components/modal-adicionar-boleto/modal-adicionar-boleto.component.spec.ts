/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModalAdicionarBoletoComponent } from './modal-adicionar-boleto.component';

describe('ModalAdicionarBoletoComponent', () => {
  let component: ModalAdicionarBoletoComponent;
  let fixture: ComponentFixture<ModalAdicionarBoletoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAdicionarBoletoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdicionarBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
