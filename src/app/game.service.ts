import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BattleService } from './battle.service';

export interface Player {
  name: string;
  class: string;
  STR: number;
  DEX: number;
  VIT: number;
  INT: number;
  LUK: number;
  specialAbility: SpecialAbility;
}

export interface SpecialAbility {
  name: string;
  description: string;
  execute: (attacker: Player, defender: Player) => string;
}

export const specialAbilities: SpecialAbility[] = [
  {
    name: 'Double Strike',
    description: 'Attacks twice in one turn',
    execute: (attacker, defender) => {
      let result = '';
      result += BattleService.prototype.physicalAttack(attacker, defender);
      if (defender.VIT > 0) {
        result += BattleService.prototype.physicalAttack(attacker, defender);
      }
      return result;
    }
  },
  {
    name: 'Healing Light',
    description: 'Heals the attacker for 50% of their INT',
    execute: (attacker, defender) => {
      const healAmount = attacker.INT * 0.5;
      attacker.VIT += healAmount;
      return `${attacker.name} heals for ${healAmount} health.<br>`;
    }
  },
  {
    name: 'Fireball',
    description: 'Deals INT*2 damage to the defender',
    execute: (attacker, defender) => {
      const damage = attacker.INT * 2 - defender.INT / 2;
      defender.VIT -= damage;
      return `${attacker.name} casts Fireball on ${defender.name} for ${damage} magic damage.<br>`;
    }
  }
];

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private players: Player[] = [];
  private playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();

  constructor() {}

  generateRandomAttributes(existingPlayersCount: number): Player {
    const abilities = specialAbilities;
    const randomAbility = abilities[Math.floor(Math.random() * abilities.length)];

    const classes = ['Sorcerer', 'Druid', 'Paladin', 'Knight'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];

    const newPlayer: Player = {
      name: `Player${existingPlayersCount + 1}`,
      class: randomClass,
      STR: Math.max(Math.floor(Math.random() * 100), 0),
      DEX: Math.max(Math.floor(Math.random() * 100), 0),
      VIT: Math.max(Math.floor(Math.random() * 100), 0),
      INT: Math.max(Math.floor(Math.random() * 100), 0),
      LUK: Math.max(Math.floor(Math.random() * 100), 0),
      specialAbility: randomAbility
    };

    return newPlayer;
  }

  addPlayer(player: Player) {
    if (this.players.length < 2) {
      this.players.push(player);
      this.playersSubject.next(this.players);
    } else {
      console.error('Ya hay dos jugadores en el juego.');
    }
  }

  resetPlayers() {
    this.players = [];
    this.playersSubject.next(this.players);
  }

  resetGame() {
    this.playersSubject.next([]);
  }
}