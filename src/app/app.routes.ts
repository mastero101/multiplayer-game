import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameBoardComponent } from './game-board/game-board.component';
import { BattleComponent } from './battle/battle.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/game-board', pathMatch: 'full' },
  { path: 'game-board', component: GameBoardComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class AppRoutingModule { }