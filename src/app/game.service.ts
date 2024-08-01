import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BattleService } from './battle.service';

import axios from 'axios';

export interface Player {
  name: string;
  class: string;
  STR: number;
  DEX: number;
  VIT: number;
  INT: number;
  LUK: number;
  specialAbility: SpecialAbility;
  freePoints: number;
  [key: string]: any;
}

export interface SpecialAbility {
  name: string;
  description: string;
  execute: (attacker: Player, defender: Player) => string;
  classes: string[];
}

export const specialAbilities: SpecialAbility[] = [
  {
    name: 'Double Strike',
    description: 'Attacks twice in one turn',
    execute: (attacker: Player, defender: Player) => {
      let result = '';
      result += BattleService.prototype.physicalAttack(attacker, defender);
      if (defender.VIT > 0) {
        result += BattleService.prototype.physicalAttack(attacker, defender);
      }
      return result;
    },
    classes: ['Knight', 'Paladin'] // Clases permitidas
  },
  {
    name: 'Healing Light',
    description: 'Heals the attacker for 50% of their INT',
    execute: (attacker: Player, defender: Player) => {
      const healAmount = attacker.INT * 0.5;
      attacker.VIT += healAmount;
      return `${attacker.name} heals for ${healAmount} health.<br>`;
    },
    classes: ['Druid', 'Paladin'] // Clases permitidas
  },
  {
    name: 'Fireball',
    description: 'Deals INT*1.5 damage to the defender',
    execute: (attacker: Player, defender: Player) => {
      const damage = attacker.INT * 1.5- defender.INT / 2;
      defender.VIT -= damage;
      return `${attacker.name} casts Fireball on ${defender.name} for ${damage} magic damage.<br>`;
    },
    classes: ['Sorcerer', 'Druid'] // Clases permitidas
  },
  {
    name: 'Absolute Defense',
    description: 'Greatly increases defense at the cost of STR',
    execute: (attacker: Player, defender: Player) => {
      const defenseIncrease = attacker.VIT * 0.5;
      attacker.VIT += defenseIncrease;
      attacker.STR -= defenseIncrease * 0.5;
      return `${attacker.name} uses Absolute Defense, increasing VIT by ${defenseIncrease} at the cost of STR.<br>`;
    },
    classes: ['Knight'] // Clases permitidas
  },
  {
    name: 'Mana Shield',
    description: 'Increases defense at the cost of INT',
    execute: (attacker: Player, defender: Player) => {
      const defenseIncrease = attacker.INT * 0.5;
      attacker.VIT += defenseIncrease * 0.5;
      attacker.INT -= defenseIncrease;
      attacker.INT = Math.max(attacker.INT, 0);
      return `${attacker.name} uses Mana Shield, increasing VIT by ${defenseIncrease} at the cost of INT.<br>`;
    },
    classes: ['Sorcerer'] // Clases permitidas
  },
  {
    name: 'Double Speed',
    description: 'Greatly increases agility (DEX) at the cost of VIT',
    execute: (attacker: Player, defender: Player) => {
      const dexIncrease = attacker.DEX * 0.5;
      attacker.DEX += dexIncrease;
      attacker.VIT -= dexIncrease * 0.5;
      return `${attacker.name} uses Double Speed, increasing DEX by ${dexIncrease} at the cost of VIT.<br>`;
    },
    classes: ['Paladin'] // Clases permitidas
  },
  {
    name: 'Maximum Healing',
    description: 'Fully regenerates health, greatly increasing VIT',
    execute: (attacker: Player, defender: Player) => {
      const healAmount = attacker.VIT * 2;
      attacker.VIT += healAmount;
      return `${attacker.name} uses Maximum Healing, fully regenerating health and increasing VIT by ${healAmount}.<br>`;
    },
    classes: ['Druid'] // Clases permitidas
  }
];

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private players: Player[] = [];
  private playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();

  private apiUrl2 = 'http://localhost:5000/player';
  private apiUrl = 'https://rpg21-game-backend.vercel.app/player';

  constructor() {}

  generateRandomAttributes(existingPlayersCount: number): Player {
    const classes = ['Sorcerer', 'Druid', 'Paladin', 'Knight'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
  
    let newPlayer: Player;
  
    const abilitiesForClass = specialAbilities.filter(ability => ability.classes.includes(randomClass));
    const randomAbility = abilitiesForClass[Math.floor(Math.random() * abilitiesForClass.length)];
  
    switch(randomClass) {
      case 'Sorcerer':
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: Math.max(Math.floor(Math.random() * 30) + 1, 1),   // Baja STR
          DEX: Math.max(Math.floor(Math.random() * 60) + 20, 1), // Media DEX
          VIT: Math.max(Math.floor(Math.random() * 30) + 1, 1),   // Baja VIT
          INT: Math.max(Math.floor(Math.random() * 50) + 50, 1), // Elevada INT
          LUK: Math.max(Math.floor(Math.random() * 100), 1),  // Aleatoria LUK
          specialAbility: randomAbility,
          freePoints: 20
        };
        break;
      case 'Druid':
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: Math.max(Math.floor(Math.random() * 30) + 1, 1),   // Baja STR
          DEX: Math.max(Math.floor(Math.random() * 60) + 20, 1), // Media DEX
          VIT: Math.max(Math.floor(Math.random() * 50) + 20, 1), // Media VIT
          INT: Math.max(Math.floor(Math.random() * 50) + 50, 1), // Elevada INT
          LUK: Math.max(Math.floor(Math.random() * 100), 1),  // Aleatoria LUK
          specialAbility: randomAbility,
          freePoints: 20
        };
        break;
      case 'Paladin':
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: Math.max(Math.floor(Math.random() * 50) + 20, 1), // Media STR
          DEX: Math.max(Math.floor(Math.random() * 80) + 20, 1), // Alta DEX
          VIT: Math.max(Math.floor(Math.random() * 50) + 20, 1), // Media VIT
          INT: Math.max(Math.floor(Math.random() * 50) + 20, 1), // Media INT
          LUK: Math.max(Math.floor(Math.random() * 100), 1),  // Aleatoria LUK
          specialAbility: randomAbility,
          freePoints: 20
        };
        break;
      case 'Knight':
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: Math.max(Math.floor(Math.random() * 50) + 50, 1), // Alta STR
          DEX: Math.max(Math.floor(Math.random() * 60) + 20, 1), // Media DEX
          VIT: Math.max(Math.floor(Math.random() * 50) + 50, 1), // Alta VIT
          INT: Math.max(Math.floor(Math.random() * 30) + 1, 1),   // Baja INT
          LUK: Math.max(Math.floor(Math.random() * 100), 1),  // Aleatoria LUK
          specialAbility: randomAbility,
          freePoints: 20
        };
        break;
      default:
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: Math.max(Math.floor(Math.random() * 100), 1),
          DEX: Math.max(Math.floor(Math.random() * 100), 1),
          VIT: Math.max(Math.floor(Math.random() * 100), 1),
          INT: Math.max(Math.floor(Math.random() * 100), 1),
          LUK: Math.max(Math.floor(Math.random() * 100), 1),
          specialAbility: randomAbility,
          freePoints: 20
        };
        break;
    }
  
    return newPlayer;
  }

  async fetchPlayerByAccountId(accountId: string): Promise<Player | null> {
    try {
      const authToken = sessionStorage.getItem('authToken');
      const response = await axios.get<Player>(
        `${this.apiUrl}`+`/byaccount/${accountId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log(response.data);
      return this.transformPlayerData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching player:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  }

  private transformPlayerData(data: any): Player {
    // Buscar la habilidad especial desde el array de habilidades
    const specialAbility = (data.abilities && data.abilities.length > 0) 
      ? specialAbilities.find(ability => ability.name === data.abilities[0].name) 
      : undefined;
  
    // Usar una habilidad predeterminada si no se encuentra ninguna
    const defaultAbility: SpecialAbility = {
      name: 'Default Ability',
      description: 'No special ability assigned.',
      execute: (attacker: Player, defender: Player) => `No special ability.`,
      classes: [] // Puede ser una lista vacía o puedes definir algo más si lo prefieres
    };
  
    return {
      name: data.name,
      class: data.class,
      STR: data.STR || data.str || 0,
      DEX: data.DEX || data.dex || 0,
      VIT: data.VIT || data.vit || 0,
      INT: data.INT || data.int || 0,
      LUK: data.LUK || data.luk || 0,
      specialAbility: specialAbility || defaultAbility, // Asignar habilidad predeterminada si es necesario
      freePoints: data.freePoints || 0,
      _id: data._id,
      experience: data.experience || 0,
      accountId: data.accountId
    };
  }

  addPlayer(player: Player) {
    const currentPlayers = this.playersSubject.getValue();
    this.playersSubject.next([...currentPlayers, player]);
  }

  resetPlayers() {
    this.players = [];
    this.playersSubject.next(this.players);
  }

  resetGame() {
    this.playersSubject.next([]);
  }
}