import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameService, Player } from '../game.service';
import { MatButtonModule } from '@angular/material/button';

import { PlayerStatsComponent } from "../player-stats/player-stats.component";
import { BattleComponent } from "../battle/battle.component";

import { PlayerCreationComponent } from '../player-creation/player-creation.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    PlayerStatsComponent,
    CommonModule,
    MatButtonModule,
    BattleComponent,
    PlayerCreationComponent
],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit, AfterViewChecked {
  players: Player[] = [];
  player1!: Player;
  player2!: Player;
  battleStarted = false;
  creatingPlayer = false;

  private shouldScroll = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.players$.subscribe(players => this.players = players);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToSection();
      this.shouldScroll = false;
    }
  }

  addRandomPlayer() {
    const newPlayer = this.gameService.generateRandomAttributes(this.players.length);
    this.gameService.addPlayer(newPlayer);
  }

  createPlayer() {
    this.creatingPlayer = true;
    this.shouldScroll = true;
  }

  onPlayerCreated(player: Player) {
    this.gameService.addPlayer(player);
    this.creatingPlayer = false;
    this.shouldScroll = true;
  }

  startBattle() {
    if (this.players.length < 2) {
      alert('Need at least 2 players to start a battle.');
      return;
    }
    this.player1 = this.players[0];
    this.player2 = this.players[1];
    this.battleStarted = !this.battleStarted;
    this.shouldScroll = true;
  }

  private scrollToSection() {
    const sectionId = this.battleStarted ? 'battle-section' : 'player-creation-section';
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
