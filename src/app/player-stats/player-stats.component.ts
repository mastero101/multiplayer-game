import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../game.service';

@Component({
  selector: 'app-player-stats',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './player-stats.component.html',
  styleUrl: './player-stats.component.scss'
})
export class PlayerStatsComponent implements OnInit, OnChanges {
  @Input() player!: Player;
  vitPercentage: number = 100;
  vitBarClass: string = 'green';

  ngOnInit(): void {
    this.updateVitPercentage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player']) {
      this.updateVitPercentage();
    }
  }

  private updateVitPercentage() {
    const maxVit = 100; // Suponiendo que el valor máximo de VIT es 100
    this.vitPercentage = Math.min((this.player.VIT / maxVit) * 100, 100);

    // Determinar el color de la barra según el porcentaje de salud
    if (this.vitPercentage > 66) {
      this.vitBarClass = 'green';
    } else if (this.vitPercentage > 33) {
      this.vitBarClass = 'yellow';
    } else {
      this.vitBarClass = 'red';
    }
  }
}
