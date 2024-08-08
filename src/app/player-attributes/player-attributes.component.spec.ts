import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAttributesComponent } from './player-attributes.component';

describe('PlayerAttributesComponent', () => {
  let component: PlayerAttributesComponent;
  let fixture: ComponentFixture<PlayerAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAttributesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
