import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessMultiplayerComponent } from './chess-multiplayer.component';

describe('ChessMultiplayerComponent', () => {
  let component: ChessMultiplayerComponent;
  let fixture: ComponentFixture<ChessMultiplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessMultiplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessMultiplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
