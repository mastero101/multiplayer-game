import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Player } from '../game.service';
import { PlayerStatsComponent } from "../player-stats/player-stats.component";

import { MatButtonModule } from '@angular/material/button';

import { BattleService } from '../battle.service';

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [
    PlayerStatsComponent,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './battle.component.html',
  styleUrl: './battle.component.scss'
})
export class BattleComponent {
  @Input() player1!: Player;
  @Input() player2!: Player;
  result: string | null = null;

  constructor(private battleService: BattleService) {}

  startBattle() {
    this.result = this.battleService.battle(this.player1, this.player2);
  }

  restartBattle() {
    window.location.reload(); // Reset the result
  }
}
