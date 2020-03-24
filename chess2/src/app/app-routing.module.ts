import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { MazeComponent } from './maze/maze/maze.component';
import {MultiplayerComponent} from "./maze/multiplayer/multiplayer.component";


const routes: Routes = [
  { component: BoardComponent, path: 'board' },
  { path: 'maze', component: MazeComponent },
  { path: 'maze/multi', component: MultiplayerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
