import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isSmallScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    return width < 768;
  }

}
