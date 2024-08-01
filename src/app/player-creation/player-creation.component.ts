import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameService, Player } from '../game.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import axios from 'axios';

import { PlayerStatsComponent } from "../player-stats/player-stats.component";
import { BattleComponent } from "../battle/battle.component";
import { specialAbilities } from '../game.service';

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

  constructor(private gameService: GameService, private snackBar: MatSnackBar) {
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
  
      // Include accountId in the newPlayer object and ensure all attributes are present
      const playerData = {
        name: this.newPlayer.name,
        class: this.newPlayer.class,
        STR: this.newPlayer.STR,
        DEX: this.newPlayer.DEX,
        VIT: this.newPlayer.VIT,
        INT: this.newPlayer.INT,
        LUK: this.newPlayer.LUK,
        freePoints: this.newPlayer.freePoints,
        accountId: accountId,
        abilities: this.newPlayer.specialAbility,
      };
  
      // Set up the Axios request with the JWT in the headers
      const response = await axios.post(this.apiUrl, playerData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Player created successfully:', response.data);
      this.playerCreated.emit(response.data); // Emit the player data returned from the server
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400 && error.response.data.message === 'Ya existe un jugador asociado a esta cuenta') {
          console.error('Cannot create more than one player per account');
          this.snackBar.open('You already have a created player. Cannot create more.', 'Close', { duration: 5000 });
        } else {
          console.error('Error creating player:', error.response.data);
          this.snackBar.open('Error Creating Player', 'Close', { duration: 3000 });
        }
      } else {
        console.error('Unexpected error:', error);
        this.snackBar.open('Unexpected Error Creating Player', 'Close', { duration: 3000 });
      }
    }
  }

   // Function to assign a special ability based on the player's class
   assignSpecialAbility() {
    const abilitiesForClass = specialAbilities.filter((ability) =>
      ability.classes.includes(this.newPlayer.class)
    );

    if (abilitiesForClass.length > 0) {
      // Seleccionar una habilidad especial aleatoria de las disponibles para la clase del jugador
      const randomAbility =
        abilitiesForClass[Math.floor(Math.random() * abilitiesForClass.length)];

      // Asignar la habilidad especial al jugador
      this.newPlayer.specialAbility = randomAbility;
    } else {
      console.warn(`No special abilities available for class: ${this.newPlayer.class}`);
    }
  }
}
