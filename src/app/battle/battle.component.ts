import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class BattleComponent implements AfterViewInit {
  @Input() player1!: Player;
  @Input() player2!: Player;
  @ViewChild('battleContainer') battleContainer!: ElementRef;
  battleLog: string[] = [];
  result: string | null = null;

  constructor(private battleService: BattleService) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  startBattle() {
    this.battleService.battle(this.player1, this.player2).subscribe(
      steps => {
        this.processSteps(steps);
      },
      error => {
        console.error('Error during battle:', error);
      }
    );
  }

  private processSteps(steps: string[]) {
    if (steps.length === 0) return;

    this.battleLog.push(steps[0]);
    this.scrollToBottom();

    let index = 1;
    const interval = setInterval(() => {
      if (index < steps.length) {
        this.battleLog.push(steps[index]);
        index++;
        this.scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, 2000); 
  }


  restartBattle() {
    window.location.reload(); // Reset the result
  }

  private scrollToBottom() {
    if (this.battleContainer) {
      this.battleContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }
}
