import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BoardComponent} from './board/board.component';
import {MazeComponent} from './maze/maze/maze.component';
import {MultiplayerComponent} from "./maze/multiplayer/multiplayer.component";
import {PublicChatComponent} from "./public-chat/public-chat.component";
import {AuthGuard} from "./security/auth.guard";
import {TicTacToeComponent} from "./tic-tac-toe/tic-tac-toe.component";
import {MainComponent} from "./main/main.component";


const routes: Routes = [
  {component: BoardComponent, path: 'board'},
  {component: PublicChatComponent, path: 'chat'},
  {path: 'maze', component: MazeComponent},
  {path: 'maze/multi', component: MultiplayerComponent},
  {path: 'maze/multi/:game', component: MultiplayerComponent},
  {path: 'tic', component: TicTacToeComponent},
  {path: 'tic/:game', component: TicTacToeComponent},
  {component: MainComponent, path: '**'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
