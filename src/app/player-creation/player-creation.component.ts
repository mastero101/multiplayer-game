import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameService, Player } from '../game.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PlayerStatsComponent } from "../player-stats/player-stats.component";
import { BattleComponent } from "../battle/battle.component";

@Component({
  selector: 'app-player-creation',
  standalone: true,
  imports: [
    PlayerStatsComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BattleComponent
  ],
  templateUrl: './player-creation.component.html',
  styleUrl: './player-creation.component.scss'
})
export class PlayerCreationComponent {
  newPlayer: Player;

  @Output() playerCreated = new EventEmitter<Player>();

  constructor(private gameService: GameService) {
    this.newPlayer = this.gameService.generateRandomAttributes(0);
  }

  addPoint(attribute: string) {
    if (this.newPlayer.freePoints > 0) {
      this.newPlayer[attribute]++;
      this.newPlayer.freePoints--;
    }
  }

  subtractPoint(attribute: string) {
    if (this.newPlayer[attribute] > 0) {
      this.newPlayer[attribute]--;
      this.newPlayer.freePoints++;
    }
  }

  savePlayer() {
    this.playerCreated.emit(this.newPlayer);
  }
}
