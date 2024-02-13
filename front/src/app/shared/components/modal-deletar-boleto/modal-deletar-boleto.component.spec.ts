/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ModalDeletarBoletoComponent } from './modal-deletar-boleto.component';


describe('ModalDeletarBoletoComponent', () => {
  let component: ModalDeletarBoletoComponent;
  let fixture: ComponentFixture<ModalDeletarBoletoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeletarBoletoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeletarBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
