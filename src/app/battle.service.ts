import { Injectable } from '@angular/core';

import { Player } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  constructor() {}

  battle(player1: Player, player2: Player): string {
    let result: string = '';
    let round = 1;

    while (player1.VIT > 0 && player2.VIT > 0) {
      result += `Round ${round}:<br>`;
      result += this.takeTurn(player1, player2);
      if (player2.VIT > 0) {
        result += this.takeTurn(player2, player1);
      }
      round++;
    }

    if (player1.VIT > 0) {
      result += `${player1.name} wins!`;
    } else if (player2.VIT > 0) {
      result += `${player2.name} wins!`;
    } else {
      result += `It's a tie!`;
    }

    return result;
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
      let damage = attacker.STR - defender.VIT / 2;
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
      let damage = attacker.INT * 1.5 - defender.INT / 2;
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
