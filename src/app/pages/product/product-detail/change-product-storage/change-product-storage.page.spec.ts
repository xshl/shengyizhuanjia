import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeProductStoragePage } from './change-product-storage.page';

describe('ChangeProductStoragePage', () => {
  let component: ChangeProductStoragePage;
  let fixture: ComponentFixture<ChangeProductStoragePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeProductStoragePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeProductStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
