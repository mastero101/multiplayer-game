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