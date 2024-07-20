import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Player } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  constructor() {}

  battle(player1: Player, player2: Player): Observable<string[]> {
    const steps: string[] = [];
    let round = 1;

    while (player1.VIT > 0 && player2.VIT > 0) {
      steps.push(`Round ${round}:`);
      steps.push(this.takeTurn(player1, player2));
      if (player2.VIT > 0) {
        steps.push(this.takeTurn(player2, player1));
      }
      round++;
    }

    if (player1.VIT > 0) {
      steps.push(`${player1.name} Wins!`);
    } else if (player2.VIT > 0) {
      steps.push(`${player2.name} Wins!`);
    } else {
      steps.push(`It's a Tie!`);
    }

    // Usar un Observable para emitir los pasos con retraso
    return new Observable<string[]>(observer => {
      let index = 0;
      const delayBetweenSteps = 1800; // 2.5 segundo de delay entre pasos

      // Emitir el primer paso sin retraso
      if (steps.length > 0) {
        observer.next([steps[index]]);
        index++;
      }

      const intervalId = setInterval(() => {
        if (index < steps.length) {
          observer.next([steps[index]]);
          index++;
        } else {
          clearInterval(intervalId);
          observer.complete();
        }
      }, delayBetweenSteps);
    });
  }

  private takeTurn(attacker: Player, defender: Player): string {
    const useSpecial = Math.random() < 0.3; // 30% chance to use special ability
    if (useSpecial) {
      return this.useSpecialAbility(attacker, defender);
    } else {
      const isPhysicalAttack = Math.random() > 0.5;
      if (isPhysicalAttack) {
        return this.physicalAttack(attacker, defender);
      } else {
        return this.magicAttack(attacker, defender);
      }
    }
  }

  private useSpecialAbility(attacker: Player, defender: Player): string {
    return attacker.specialAbility.execute(attacker, defender);
  }

  public physicalAttack(attacker: Player, defender: Player): string {
    const hitChance = Math.random() * 100;
    const hitThreshold = 50 + attacker.DEX - defender.DEX;

    if (hitChance <= hitThreshold) {
      let damage = attacker.STR * 1.2 - defender.VIT / 2;
      if (damage < 0) {
        damage = 0;
      }

      const critChance = Math.random() * 100;
      if (critChance <= attacker.LUK) {
        damage *= 2;
        defender.VIT -= damage;
        return `${attacker.name} hits a critical strike on ${defender.name} for ${damage} physical damage!<br>`;
      } else {
        defender.VIT -= damage;
        return `${attacker.name} hits ${defender.name} for ${damage} physical damage.<br>`;
      }
    } else {
      return `${attacker.name} misses ${defender.name}.<br>`;
    }
  }

  private magicAttack(attacker: Player, defender: Player): string {
    const hitChance = Math.random() * 100;
    const hitThreshold = 50 + attacker.INT - defender.INT;

    if (hitChance <= hitThreshold) {
      let damage = attacker.INT * 1.1 - defender.INT / 2;
      if (damage < 0) {
        damage = 0;
      }

      const critChance = Math.random() * 100;
      if (critChance <= attacker.LUK) {
        damage *= 2;
        defender.VIT -= damage;
        return `${attacker.name} casts a critical spell on ${defender.name} for ${damage} magic damage!<br>`;
      } else {
        defender.VIT -= damage;
        return `${attacker.name} casts a spell on ${defender.name} for ${damage} magic damage.<br>`;
      }
    } else {
      return `${attacker.name}'s spell misses ${defender.name}.<br>`;
    }
  }
}
