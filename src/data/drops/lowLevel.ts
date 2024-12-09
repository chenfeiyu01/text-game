import { DropItemType, DropRule } from "../../constants/drop";
import { ItemId } from "../../constants/item";
import { Monsters } from "../../constants/monsters";
import { ESCENES } from "../../constants/scenes";

/**
 * 怪物掉落配置
 * @description 定义了每个怪物的掉落物品规则
 * @type {Record<Monsters, DropRule[]>}
 */
export const MONSTER_DROPS: Record<Monsters, DropRule[]> = {
  /** 训练假人 - 无掉落 */
  [Monsters.TRAINING_DUMMY]: [],

  /** 
   * 1-5级怪物掉落
   */
  [Monsters.CORRUPTED_RABBIT]: [
    {
      itemId: ItemId.Consumable.HEALTH_POTION_1,
      type: DropItemType.NORMAL,
      baseChance: 0.3,
      minQuantity: 1,
      maxQuantity: 2,
      condition: { maxLevel: 10 },
    },
    {
      itemId: ItemId.Gear.COPPER_RING,
      type: DropItemType.RARE,
      baseChance: 0.05,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ],

  [Monsters.SHADOW_WOLF]: [
    {
      itemId: ItemId.Consumable.HEALTH_POTION_1,
      type: DropItemType.NORMAL,
      baseChance: 0.4,
      minQuantity: 1,
      maxQuantity: 2,
    },
    {
      itemId: ItemId.Gear.WOODEN_SWORD,
      type: DropItemType.RARE,
      baseChance: 0.08,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ],

  /**
   * 6-10级怪物掉落
   */
  [Monsters.CORRUPTED_VINE]: [
    {
      itemId: ItemId.Consumable.MANA_POTION_1,
      type: DropItemType.NORMAL,
      baseChance: 0.3,
      minQuantity: 1,
      maxQuantity: 2,
    },
    {
      itemId: ItemId.Gear.IRON_SWORD,
      type: DropItemType.RARE,
      baseChance: 0.1,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ],

  [Monsters.MUSHROOM_WARRIOR]: [
    {
      itemId: ItemId.Consumable.WARRIORS_POTION,
      type: DropItemType.NORMAL,
      baseChance: 0.2,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ],

  /**
   * 11-15级怪物掉落
   */
  [Monsters.SHADOW_CROCODILE]: [
    {
      itemId: ItemId.Consumable.HEALTH_POTION_1,
      type: DropItemType.NORMAL,
      baseChance: 0.4,
      minQuantity: 1,
      maxQuantity: 2,
    },
    {
      itemId: ItemId.Gear.STEEL_SWORD,
      type: DropItemType.RARE,
      baseChance: 0.1,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ],

  /**
   * Boss掉落配置
   */
  [Monsters.ALPHA_SHADOW_WOLF]: [
    {
      itemId: ItemId.Gear.RUNIC_SWORD,
      type: DropItemType.RARE,
      baseChance: 0.05,
      minQuantity: 1,
      maxQuantity: 1,
    },
    {
      itemId: ItemId.Gear.RUNIC_LEATHER,
      type: DropItemType.RARE,
      baseChance: 0.05,
      minQuantity: 1,
      maxQuantity: 1,
    },
    {
      itemId: ItemId.Gear.MANA_RING,
      type: DropItemType.RARE,
      baseChance: 0.05,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ],

  [Monsters.ANCIENT_MUSHROOM_LORD]: [
    {
      itemId: ItemId.Gear.KNIGHTS_SWORD,
      type: DropItemType.BOSS,
      baseChance: 0.2,
      minQuantity: 1,
      maxQuantity: 1,
    },
    {
      itemId: ItemId.Gear.RUNIC_LEATHER,
      type: DropItemType.BOSS,
      baseChance: 0.05,
      minQuantity: 1,
      maxQuantity: 1,
    },
    {
      itemId: ItemId.Gear.WARRIORS_BAND,
      type: DropItemType.BOSS,
      baseChance: 0.05,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ],

  [Monsters.CORRUPTED_ARCHDRUID]: [
    {
      itemId: ItemId.Gear.COMMANDER_BLADE,
      type: DropItemType.BOSS,
      baseChance: 0.1,
      minQuantity: 1,
      maxQuantity: 1,
    },
    {
      itemId: ItemId.Gear.DRAGON_HEART_PENDANT,
      type: DropItemType.BOSS,
      baseChance: 0.1,
      minQuantity: 1,
      maxQuantity: 1,
    },
  ],

  /** TODO: 待补充其他怪物掉落配置 */
  [Monsters.POISON_TOAD]: [],
  [Monsters.ANCIENT_TREANT]: [],
  [Monsters.SHADOW_PRIEST]: [],
  [Monsters.SWAMP_HORROR]: [],
};

/**
 * 场景掉落修正配置
 * @description 定义了不同场景对掉落概率的修正系数
 */
export const SCENE_DROP_MODIFIERS = {
  [ESCENES.MAPLE_FOREST]: {
    /** 整体掉落概率修正 */
    chanceMultiplier: 1.2,
    /** 特定物品掉落概率修正 */
    itemModifiers: {
      [ItemId.Gear.WOODEN_SWORD]: {
        chanceMultiplier: 1.5,
      },
    },
  },
};
