import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessPromoteDialogComponent } from './chess-promote-dialog.component';

describe('ChessPromoteDialogComponent', () => {
  let component: ChessPromoteDialogComponent;
  let fixture: ComponentFixture<ChessPromoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessPromoteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessPromoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
