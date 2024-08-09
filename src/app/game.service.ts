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
  level: number;
  experience: number;
  specialAbility: SpecialAbility;
  freePoints: number;
  _id: string;
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
    const playerLevel = parseInt(sessionStorage.getItem('playerLevel') || '1', 10);
    const classes = ['Sorcerer', 'Druid', 'Paladin', 'Knight'];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
  
    const totalPoints = 20 + (playerLevel - 1) * 4;
    let remainingPoints = totalPoints;
  
    let newPlayer: Player;
  
    const abilitiesForClass = specialAbilities.filter(ability => ability.classes.includes(randomClass));
    const randomAbility = abilitiesForClass[Math.floor(Math.random() * abilitiesForClass.length)];
  
    const distributePoints = (min: number, max: number) => {
      const points = Math.max(min, Math.min(Math.floor(Math.random() * (max - min + 1)) + min, remainingPoints));
      remainingPoints -= points;
      return points;
    };
  
    switch(randomClass) {
      case 'Sorcerer':
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: distributePoints(1, 3),
          DEX: distributePoints(2, 4),
          VIT: distributePoints(1, 3),
          INT: distributePoints(5, Math.max(8, totalPoints * 0.4)),
          LUK: distributePoints(1, 10),
          specialAbility: randomAbility,
          freePoints: 0,
          level: playerLevel,
          experience: 0,
          _id: ''
        };
        break;
      case 'Druid':
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: distributePoints(1, 3),
          DEX: distributePoints(2, 4),
          VIT: distributePoints(2, 5),
          INT: distributePoints(5, Math.max(8, totalPoints * 0.4)),
          LUK: distributePoints(1, 10),
          specialAbility: randomAbility,
          freePoints: 0,
          level: playerLevel,
          experience: 0,
          _id: ''
        };
        break;
      case 'Paladin':
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: distributePoints(2, 5),
          DEX: distributePoints(2, Math.max(10, totalPoints * 0.3)),
          VIT: distributePoints(2, 5),
          INT: distributePoints(2, 5),
          LUK: distributePoints(1, 10),
          specialAbility: randomAbility,
          freePoints: 0,
          level: playerLevel,
          experience: 0,
          _id: ''
        };
        break;
      case 'Knight':
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: distributePoints(5, Math.max(5, totalPoints * 0.3)),
          DEX: distributePoints(2, 6),
          VIT: distributePoints(5, Math.max(10, totalPoints * 0.3)),
          INT: distributePoints(1, 3),
          LUK: distributePoints(1, 10),
          specialAbility: randomAbility,
          freePoints: 0,
          level: playerLevel,
          experience: 0,
          _id: ''
        };
        break;
      default:
        newPlayer = {
          name: `Player${existingPlayersCount + 1}`,
          class: randomClass,
          STR: distributePoints(1, totalPoints * 0.2),
          DEX: distributePoints(1, totalPoints * 0.2),
          VIT: distributePoints(1, totalPoints * 0.2),
          INT: distributePoints(1, totalPoints * 0.2),
          LUK: distributePoints(1, totalPoints * 0.2),
          specialAbility: randomAbility,
          freePoints: 0,
          level: playerLevel,
          experience: 0,
          _id: ''
        };
        break;
    }
  
    // Distribuir los puntos restantes aleatoriamente
    const attributes = ['STR', 'DEX', 'VIT', 'INT', 'LUK'];
    while (remainingPoints > 0) {
      const randomAttribute = attributes[Math.floor(Math.random() * attributes.length)];
      newPlayer[randomAttribute as keyof Player]++;
      remainingPoints--;
    }
  
    return newPlayer;
  }

  async fetchPlayerByAccountId(accountId: string): Promise<Player | null> {
    try {
      const authToken = sessionStorage.getItem('authToken');
      const response = await axios.get<Player>(
        `${this.apiUrl}/byaccount/${accountId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
  
      const player = this.transformPlayerData(response.data);
  
      // Almacenar el _id en sessionStorage
      if (player) {
        sessionStorage.setItem('playerId', player._id);
        sessionStorage.setItem('playerLevel', player.level.toString());
      }
  
      console.log(response.data);
      return player;
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
      classes: []
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
      level: data.level || 0, 
      accountId: data.accountId
    };
  }

  async distributePoints(playerId: string, pointsDistribution: { [key: string]: number }): Promise<void> {
    try {
      const response = await axios.patch(
        `${this.apiUrl}/${playerId}/distribute-points`,
        { pointsDistribution }
      );
      console.log('Points distributed successfully:', response.data);
      
      // Actualizar el jugador localmente después de la distribución de puntos
      const updatedPlayer = response.data.player;
      this.updatePlayer(updatedPlayer);
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error distributing points:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }
  
  private updatePlayer(updatedPlayer: Player) {
    const currentPlayers = this.playersSubject.getValue();
    const playerIndex = currentPlayers.findIndex(player => player._id === updatedPlayer._id);
    if (playerIndex !== -1) {
      currentPlayers[playerIndex] = updatedPlayer;
      this.playersSubject.next([...currentPlayers]);
    }
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