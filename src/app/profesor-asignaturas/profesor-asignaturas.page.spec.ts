import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesorAsignaturasPage } from './profesor-asignaturas.page';

describe('ProfesorAsignaturasPage', () => {
  let component: ProfesorAsignaturasPage;
  let fixture: ComponentFixture<ProfesorAsignaturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorAsignaturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
