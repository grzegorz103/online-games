import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BoardComponent} from './board/board.component';
import {MazeComponent} from './maze/maze/maze.component';
import {MultiplayerComponent} from "./maze/multiplayer/multiplayer.component";
import {PublicChatComponent} from "./public-chat/public-chat.component";
import {AuthGuard} from "./auth.guard";


const routes: Routes = [
  {component: BoardComponent, path: 'board'},
  {component: PublicChatComponent, path: 'chat'},
  {path: 'maze', component: MazeComponent},
  {path: 'maze/multi', component: MultiplayerComponent},
  {path: 'maze/multi/:game', component: MultiplayerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
