import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule   } from '@angular/material/snack-bar';

import { Player } from '../game.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-player-attributes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
  ],
  templateUrl: './player-attributes.component.html',
  styleUrl: './player-attributes.component.scss'
})

export class PlayerAttributesComponent implements OnInit {
  @Input() player!: Player;
  @Input() freePoints: number = 0;

  attributes = [
    { label: 'Strength (STR)', key: 'str' },
    { label: 'Dexterity (DEX)', key: 'dex' },
    { label: 'Vitality (VIT)', key: 'vit' },
    { label: 'Intelligence (INT)', key: 'int' },
    { label: 'Luck (LUK)', key: 'luk' },
  ];

  pointsDistribution: { [key: string]: number } = {};

  constructor(private gameService: GameService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const accountId = sessionStorage.getItem('accountId');
      if (accountId) {
        this.gameService.fetchPlayerByAccountId(accountId).then(player => {
          if (player) {
            this.player = player;
            this.freePoints = player.freePoints;
            console.log('Free Points:', this.freePoints);
            this.initializePointsDistribution();
          } else {
            console.error('Player not found');
          }
        }).catch(error => {
          console.error('Error fetching player:', error);
        });
      }
    } else {
      console.error('Window is undefined');
    }
  }
  
  initializePointsDistribution(): void {
    this.pointsDistribution = {
      str: 0,
      dex: 0,
      vit: 0,
      int: 0,
      luk: 0,
    };
  }

  incrementPoints(attribute: string): void {
    if (this.freePoints > 0) {
      this.pointsDistribution[attribute] =
        (this.pointsDistribution[attribute] || 0) + 1;
      this.freePoints--;
    } else {
      console.error('No free points available.');
    }
  }
  

  decrementPoints(attribute: string): void {
    if (this.pointsDistribution[attribute] > 0) {
      this.pointsDistribution[attribute]--;
      this.freePoints++;
    } else {
      console.error('Cannot decrement points below zero.');
    }
  }

  canDistributePoints(): boolean {
    if (!this.player) return false;
    const totalPointsDistributed = Object.values(this.pointsDistribution).reduce(
      (sum, points) => sum + points,
      0
    );
    return totalPointsDistributed <= this.player.freePoints;
  }

  getCurrentAttributeValue(attribute: string): number {
    if (this.player && this.player[attribute]) {
      return this.player[attribute];
    }
    return 0;
  }

  validatePoints(attribute: string): void {
    if (this.pointsDistribution[attribute] < 0) {
      this.pointsDistribution[attribute] = 0;
    }
    if (this.pointsDistribution[attribute] > this.freePoints) {
      this.pointsDistribution[attribute] = this.freePoints;
    }
  }

  refreshPlayerData(): void {
    const accountId = sessionStorage.getItem('accountId');
    if (accountId) {
      this.gameService.fetchPlayerByAccountId(accountId).then(player => {
        if (player) {
          this.player = player;
          this.freePoints = player.freePoints;
          this.initializePointsDistribution();
        } else {
          console.error('Player not found');
        }
      }).catch(error => {
        console.error('Error fetching player:', error);
      });
    }
  }

  distributePoints(): void {
    const playerId = sessionStorage.getItem('playerId');
    if (!playerId) {
      console.error('Player ID is not available');
      return;
    }
  
    if (this.canDistributePoints()) {
      console.log('Points distributed:', this.pointsDistribution);
    } else {
      console.error('Cannot distribute points. Check point allocation.');
      return;
    }
  
    this.gameService.distributePoints(playerId, this.pointsDistribution)
      .then(() => {
        console.log('Points distributed successfully');

        // Mostrar el Snackbar
        const snackBarRef = this.snackBar.open('Points distributed successfully!', 'OK', {
          duration: 3000,
        });

        // Añadir listener para cerrar el Snackbar cuando se presione "OK"
        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
          console.log('Snackbar closed by user action.');
        });

        this.refreshPlayerData(); // O usar window.location.reload();
      })
      .catch(error => {
        console.error('Error distributing points:', error);

        const snackBarRef = this.snackBar.open('Error distributing points', 'Retry', {
          duration: 3000,
        });

        // Añadir listener para el intento de repetición
        snackBarRef.onAction().subscribe(() => {
          this.distributePoints(); // Reintentar la distribución de puntos
        });
      });
  }  
}
