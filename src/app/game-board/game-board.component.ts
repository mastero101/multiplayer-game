import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameService, Player } from '../game.service';
import { MatButtonModule } from '@angular/material/button';

import { PlayerStatsComponent } from "../player-stats/player-stats.component";
import { BattleComponent } from "../battle/battle.component";

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    PlayerStatsComponent,
    CommonModule,
    MatButtonModule,
    BattleComponent
],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  players: Player[] = [];
  player1!: Player;
  player2!: Player;
  battleStarted = false

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.players$.subscribe(players => this.players = players);
  }

  addRandomPlayer() {
    const newPlayer = this.gameService.generateRandomAttributes(this.players.length);
    this.gameService.addPlayer(newPlayer);
  }

  startBattle() {
    if (this.players.length < 2) {
      alert('Need at least 2 players to start a battle.');
      return;
    }
    this.player1 = this.players[0];
    this.player2 = this.players[1];
    this.battleStarted = true;
  }
}
