const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Player = require('../models/Player');

/**
 * @swagger
 * /players/{id}:
 *   get:
 *     summary: Get a player by ID
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player found successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Some server error
 */

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const player = await Player.findById(id).populate('accountId', 'username email'); // Populate to get account details if needed
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const specialAbilities = [
  {
    name: 'Double Strike',
    description: 'Attacks twice in one turn',
    classes: ['Knight', 'Paladin'],
    level: 1 // Nivel de la habilidad
  },
  {
    name: 'Healing Light',
    description: 'Heals the attacker for 50% of their INT',
    classes: ['Druid', 'Paladin'],
    level: 1
  },
  {
    name: 'Fireball',
    description: 'Deals INT*1.5 damage to the defender',
    classes: ['Sorcerer', 'Druid'],
    level: 1
  },
  {
    name: 'Absolute Defense',
    description: 'Greatly increases defense at the cost of STR',
    classes: ['Knight'],
    level: 1
  },
  {
    name: 'Mana Shield',
    description: 'Increases defense at the cost of INT',
    classes: ['Sorcerer'],
    level: 1
  },
  {
    name: 'Double Speed',
    description: 'Greatly increases agility (DEX) at the cost of VIT',
    classes: ['Paladin'],
    level: 1
  },
  {
    name: 'Maximum Healing',
    description: 'Fully regenerates health, greatly increasing VIT',
    classes: ['Druid'],
    level: 1
  }
];

// Función para asignar una habilidad especial basada en la clase del jugador
function assignAbilityForClass(playerClass) {
  // Filtrar habilidades disponibles para la clase dada
  const availableAbilities = specialAbilities.filter(ability =>
    ability.classes.includes(playerClass)
  );

  if (availableAbilities.length > 0) {
    // Seleccionar una habilidad aleatoria entre las disponibles
    const randomAbility = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
    return randomAbility;
  } else {
    return null; // Retorna null si no hay habilidades disponibles para la clase
  }
}

/**
 * @swagger
 * /player:
 *   post:
 *     summary: Create a new player
 *     tags: [Player]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - class
 *               - accountId
 *             properties:
 *               name:
 *                 type: string
 *               class:
 *                 type: string
 *               accountId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Player created successfully
 *       500:
 *         description: Some server error
 */

// Endpoint para crear un nuevo jugador
router.post('/', async (req, res) => {
  try {
    const { name, class: playerClass, accountId, STR, DEX, VIT, INT, LUK, freePoints } = req.body;

    // Verificar campos necesarios
    if (!name || !playerClass || !accountId) {
      return res.status(400).json({ message: 'Faltan campos necesarios' });
    }

    // Verificar si ya existe un jugador asociado a esta cuenta
    const existingPlayer = await Player.findOne({ accountId });
    if (existingPlayer) {
      return res.status(400).json({ message: 'Ya existe un jugador asociado a esta cuenta' });
    }

    // Asignar una habilidad al jugador basado en su clase
    const assignedAbility = assignAbilityForClass(playerClass);
    const abilities = assignedAbility ? [assignedAbility] : [];

    // Crear el nuevo jugador con la habilidad asignada
    const newPlayer = new Player({
      name,
      class: playerClass,
      accountId,
      str: STR || 10,  // Usa el valor enviado o 10 como valor predeterminado
      dex: DEX || 10,
      vit: VIT || 10,
      int: INT || 10,
      luk: LUK || 10,
      freePoints: freePoints || 0,
      experience: 0,
      abilities: abilities // Asigna las habilidades
    });

    await newPlayer.save();

    res.status(201).json(newPlayer);
  } catch (error) {
    console.error('Error al crear el jugador:', error);
    res.status(500).json({ message: 'Error al crear el jugador' });
  }
});

/**
 * @swagger
 * /players/byaccount/{accountId}:
 *   get:
 *     summary: Get a player by accountId
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Player found successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Some server error
 */
router.get('/byaccount/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;

    // Validar el formato de ObjectId
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({ message: 'Invalid ObjectId format' });
    }

    // Encontrar el jugador asociado con el accountId dado
    const player = await Player.findOne({ accountId: accountId });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ message: 'Error fetching player' });
  }
});

/**
 * @swagger
 * /{id}/experience:
 *   patch:
 *     summary: Update player experience
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *       - in: query
 *         name: experience
 *         required: true
 *         schema:
 *           type: number
 *         description: Amount of experience to add
 *     responses:
 *       200:
 *         description: Player experience updated successfully
 *       400:
 *         description: Invalid player ID or experience value
 *       500:
 *         description: Some server error
 */

router.patch('/:id/experience', async (req, res) => {
  const { id } = req.params;
  const { experience } = req.query;

  try {
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    player.experience += Number(experience);
    await player.save();

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /{id}/stats:
 *   patch:
 *     summary: Update player stats
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *       - in: body
 *         name: stats
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             str:
 *               type: number
 *             dex:
 *               type: number
 *             vit:
 *               type: number
 *             int:
 *               type: number
 *             luk:
 *               type: number
 *     responses:
 *       200:
 *         description: Player stats updated successfully
 *       400:
 *         description: Invalid player ID or stats value
 *       500:
 *         description: Some server error
 */
router.patch('/:id/stats', async (req, res) => {
  const { id } = req.params;
  const { str, dex, vit, int, luk } = req.body;

  try {
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Update player stats
    if (str !== undefined) player.str = str;
    if (dex !== undefined) player.dex = dex;
    if (vit !== undefined) player.vit = vit;
    if (int !== undefined) player.int = int;
    if (luk !== undefined) player.luk = luk;

    await player.save();

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /{id}/abilities:
 *   post:
 *     summary: Add a new ability to a player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ability added successfully
 *       404:
 *         description: Player not found
 *       500:
 *         description: Some server error
 */
router.post('/:id/abilities', async (req, res) => {
  const { id } = req.params;
  const { name, level } = req.body;

  try {
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    player.abilities.push({ name, level });
    await player.save();

    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /{id}/abilities/{abilityId}:
 *   patch:
 *     summary: Update an existing ability of a player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *       - in: path
 *         name: abilityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ability ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ability updated successfully
 *       404:
 *         description: Player or ability not found
 *       500:
 *         description: Some server error
 */
router.patch('/:id/abilities/:abilityId', async (req, res) => {
  const { id, abilityId } = req.params;
  const { name, level } = req.body;

  try {
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const ability = player.abilities.id(abilityId);
    if (!ability) {
      return res.status(404).json({ error: 'Ability not found' });
    }

    if (name !== undefined) ability.name = name;
    if (level !== undefined) ability.level = level;

    await player.save();

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /{id}/abilities/{abilityId}:
 *   delete:
 *     summary: Remove an ability from a player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *       - in: path
 *         name: abilityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ability ID
 *     responses:
 *       200:
 *         description: Ability removed successfully
 *       404:
 *         description: Player or ability not found
 *       500:
 *         description: Some server error
 */
router.delete('/:id/abilities/:abilityId', async (req, res) => {
  const { id, abilityId } = req.params;

  try {
    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const ability = player.abilities.id(abilityId);
    if (!ability) {
      return res.status(404).json({ error: 'Ability not found' });
    }

    ability.remove();
    await player.save();

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;