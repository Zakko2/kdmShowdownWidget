export const TRAIT_CATEGORIES = [
  'All',
  'Offense',
  'Drawbacks',
  'Positioning',
  'Tactics',
  'Defense'
];

export const WEAPON_TRAITS = [
  // --- Offense-boosting ---
  {
    id: 'sharp',
    name: 'Sharp',
    category: 'Offense',
    description: "Add 1d10 strength to each wound attempt (not a wound roll, can't cause crits)"
  },
  {
    id: 'razor_sharp',
    name: 'Razor Sharp',
    category: 'Offense',
    description: 'Bonus comes from a dedicated die with pips instead of a d10'
  },
  {
    id: 'deadly',
    name: 'Deadly',
    category: 'Offense',
    luckBonus: 1,
    description: '+1 Luck on wound attempts (increases odds of critical wounds)'
  },
  {
    id: 'deadly2',
    name: 'Deadly 2',
    category: 'Offense',
    luckBonus: 2,
    description: '+2 Luck on wound attempts (increases odds of critical wounds)'
  },
  {
    id: 'deadly3',
    name: 'Deadly 3',
    category: 'Offense',
    luckBonus: 3,
    description: '+3 Luck on wound attempts (increases odds of critical wounds)'
  },
  {
    id: 'devastating',
    name: 'Devastating',
    category: 'Offense',
    description: 'When the weapon wounds a monster, inflict 1 additional wound'
  },
  {
    id: 'devastating2',
    name: 'Devastating 2',
    category: 'Offense',
    description: 'When the weapon wounds a monster, inflict 2 additional wounds'
  },
  {
    id: 'savage',
    name: 'Savage',
    category: 'Offense',
    description: "After first critical wound in attack, inflict 1 additional wound (not on Impervious)"
  },
  {
    id: 'barbed',
    name: 'Barbed',
    category: 'Offense',
    description: 'On a Perfect hit, gain +1 strength for the rest of the attack'
  },
  {
    id: 'expertise',
    name: 'Expertise',
    category: 'Offense',
    description: 'On a Perfect hit, the monster suffers an automatic wound (once per attack)'
  },
  {
    id: 'precision',
    name: 'Precision',
    category: 'Offense',
    description: 'On a Perfect hit, inflict an automatic critical wound on first hit location resolved'
  },
  {
    id: 'refined',
    name: 'Refined',
    category: 'Offense',
    description: 'If the weapon fails to wound, you may reroll the attempt once per attack'
  },
  {
    id: 'impeccable',
    name: 'Impeccable',
    category: 'Offense',
    description: 'Reroll natural 1s on wound attempts (must keep new result)'
  },

  // --- Drawbacks / risks ---
  {
    id: 'frail',
    name: 'Frail',
    category: 'Drawbacks',
    description: 'Destroyed if used to wound a Super-Dense location; archived after attack'
  },
  {
    id: 'unwieldy',
    name: 'Unwieldy',
    category: 'Drawbacks',
    description: 'Rolling a 1 on attack dice causes 1 random damage to survivor per 1 rolled'
  },
  {
    id: 'slow',
    name: 'Slow',
    category: 'Drawbacks',
    description: 'Attack speed is always 1; speed modifiers do not apply'
  },
  {
    id: 'guardless',
    name: 'Guardless',
    category: 'Drawbacks',
    description: 'You cannot ignore hits with this gear equipped'
  },
  {
    id: 'cumbersome',
    name: 'Cumbersome',
    category: 'Drawbacks',
    description: 'Requires both movement and activation to use'
  },
  {
    id: 'irreplaceable',
    name: 'Irreplaceable',
    category: 'Drawbacks',
    description: 'If the survivor dies, this gear is archived (cannot be passed on or reused)'
  },
  {
    id: 'unique',
    name: 'Unique',
    category: 'Drawbacks',
    description: 'A settlement may only own one copy at a time'
  },

  // --- Positioning / range ---
  {
    id: 'reach',
    name: 'Reach',
    category: 'Positioning',
    description: 'Can attack monsters without being adjacent, up to distance away'
  },
  {
    id: 'range',
    name: 'Range',
    category: 'Positioning',
    description: 'A ranged weapon usable only within distance, blocked by obstacles'
  },
  {
    id: 'paired',
    name: 'Paired',
    category: 'Positioning',
    description: "Two identical weapons used together; add second weapon's speed to first"
  },

  // --- Movement / positional attacks ---
  {
    id: 'charge',
    name: 'Charge',
    category: 'Tactics',
    description: 'Move max spaces in straight line, then attack, adding spaces moved to strength'
  },
  {
    id: 'pounce',
    name: 'Pounce',
    category: 'Tactics',
    description: 'Spend movement + activation to move 3 spaces and attack; +1 strength'
  },
  {
    id: 'blindside',
    name: 'Blindside',
    category: 'Tactics',
    description: "Wounding from blind spot turns all reflex reactions into failure reactions"
  },

  // --- Defense & Other ---
  {
    id: 'block',
    name: 'Block',
    category: 'Defense',
    description: 'Spend activation to ignore hits until your next act (once per attack)'
  },
  {
    id: 'persistence',
    name: 'Persistence',
    category: 'Defense',
    description: 'On a Perfect hit, gain survival'
  }
];

export const getWeaponLuckBonus = (weapon) => {
  if (!weapon || !weapon.traits) return 0;
  if (weapon.traits.includes('deadly3')) return 3;
  if (weapon.traits.includes('deadly2')) return 2;
  if (weapon.traits.includes('deadly')) return 1;
  return 0;
};

export const createWeapon = (name = 'Weapon 1') => ({
  name,
  accuracy: 0,
  strength: 0,
  traits: []
});
