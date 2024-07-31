import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameService, Player } from '../game.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import axios from 'axios';

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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    BattleComponent
  ],
  templateUrl: './player-creation.component.html',
  styleUrl: './player-creation.component.scss'
})
export class PlayerCreationComponent {
  newPlayer: Player;
  availableClasses: string[] = ['Knight', 'Paladin', 'Druid', 'Sorcerer'];

  private apiUrl2 = 'http://localhost:5000/player/';
  private apiUrl = 'https://rpg21-game-backend.vercel.app/player/';


  @Output() playerCreated = new EventEmitter<Player>();

  constructor(private gameService: GameService) {
    this.newPlayer = this.gameService.generateRandomAttributes(0);
    this.newPlayer.name = ''; // Inicializar el nombre del jugador
    this.newPlayer.class = this.availableClasses[0]; // Inicializar la clase del jugador
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

  async savePlayer() {
    try {
      // Retrieve accountId and JWT from sessionStorage
      const accountId = sessionStorage.getItem('accountId');
      const authToken = sessionStorage.getItem('authToken');
  
      // Check if accountId and authToken are present
      if (!accountId || !authToken) {
        throw new Error('User is not authenticated');
      }
  
      // Include accountId in the newPlayer object
      const playerData = {
        ...this.newPlayer,
        accountId: accountId,
      };
  
      // Set up the Axios request with the JWT in the headers
      const response = await axios.post(this.apiUrl, playerData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Player created successfully:', response.data);
      this.playerCreated.emit(this.newPlayer);
    } catch (error) {
      console.error('Error creating player:', error);
    }
  }
}
