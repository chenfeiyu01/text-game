import { MessageType } from "../constants/game-system";
import {
  GearStats,
  GearItem,
  GearSlot,
  ConsumableItem,
  ConsumableEffectType,
} from "../constants/item";
import { Monsters } from "../constants/monsters";
import { Skill, SkillEffectType } from "../constants/skill-list";
import { GameSystem } from "./game-system";
import { Inventory } from "./inventory";
import { STAT_CONFIG, StatType } from "../constants/stats";
import { Buff } from "../constants/buff";
import { BuffManager } from "./buff-manager";
import { DamageType } from "../constants/battle";

// 在文件顶部添加导出接口
export interface CharacterConfig {
  /** 角色名称 */
  name: string;
  /** 角色ID */
  id?: Monsters;
  /** 最大生命值 */
  maxHp?: number;
  /** 最大魔法值 */
  maxMp?: number;
  /** 攻击力 */
  attack?: number;
  /** 防御力 */
  defense?: number;
  /** 暴击率 */
  critRate?: number;
  /** 暴击伤害 */
  critDamage?: number;
  /** 充能效率 */
  chargeRate?: number;
  /** 已装备的技能 */
  equippedSkill?: Skill;
}

/**
 * 角色类
 * 包含角色的基本属性和战斗相关的方���
 *
 * @description
 * 主要功能:
 * - 管角色基础属性(生命值、魔法值、攻击力等)
 * - 处理战斗相关逻辑(伤害计算、技能使用等)
 * - 管理装备系统
 * - 处理等级和经验值系统
 * - 管理临时状态效果
 */
export class Character {
  /** 当前生命值 */
  private _hp: number;
  /** 当前魔法值 */
  private _mp: number;
  /** 当前经验值 */
  private _exp: number = 0;
  /** 当前等级 */
  private _level: number = 1;
  /** 当前充能值 */
  private _charge: number = 0;
  /** 状态变化回调函数集合 */
  private _stateChangeCallbacks: Set<() => void> = new Set();
  /** 角色背包��统 */
  protected _inventory: Inventory;
  /** 临时效果集合 */
  private _temporaryEffects: Map<
    string,
    {
      /** 效果数值 */
      value: number;
      /** 持续时间 */
      duration: number;
      /** 影响的属性 */
      attribute: keyof GearStats;
    }
  > = new Map();
  /** 已装备的物品 */
  private _equippedItems: Partial<Record<GearSlot, GearItem>> = {};

  /** 基础属性 */
  protected baseStats: Record<StatType, number> = {
    [StatType.ATTACK]: 0,
    [StatType.DEFENSE]: 0,
    [StatType.MAX_HP]: 0,
    [StatType.MAX_MP]: 0,
    [StatType.CRIT_RATE]: 0,
    [StatType.CRIT_DAMAGE]: 0,
    [StatType.CHARGE_RATE]: 0,
    [StatType.BONUS_DAMAGE]: 0,
    [StatType.SPELL_AFFINITY]: 0,
    [StatType.DAMAGE_REDUCTION]: 0,
    [StatType.MAGIC_RESISTANCE]: 0,
  };

  /** 加成属性（来自装备、buff等） */
  protected bonusStats: Record<StatType, number> = {
    [StatType.ATTACK]: 0,
    [StatType.DEFENSE]: 0,
    [StatType.MAX_HP]: 0,
    [StatType.MAX_MP]: 0,
    [StatType.CRIT_RATE]: 0,
    [StatType.CRIT_DAMAGE]: 0,
    [StatType.CHARGE_RATE]: 0,
    [StatType.BONUS_DAMAGE]: 0,
    [StatType.SPELL_AFFINITY]: 0,
    [StatType.DAMAGE_REDUCTION]: 0,
    [StatType.MAGIC_RESISTANCE]: 0,
  };

  /** 角色属性 */
  public stats: Partial<Record<StatType, number>> = {};

  /** 是否正在使用技能 */
  public isUsingSkill: boolean = false;

  public buffs: { stat: StatType; value: number; duration: number }[] = [];

  private buffManager: BuffManager;

  /** 角色当前状态 */
  private statusEffects: Set<string> = new Set();

  /** 装备栏 */
  protected equipment: Partial<Record<GearSlot, GearItem>> = {};

  /** 已装备的技能 */
  private _equippedSkill?: Skill;

  /**
   * 构造函数
   * @param config 角色配置对象
   * @param config.name 角色名称
   * @param config.id 角色ID
   * @param config.maxHp 最大生命值
   * @param config.maxMp 最大魔法值
   * @param config.attack 攻击力
   * @param config.defense 防御力
   * @param config.critRate 暴击率
   * @param config.critDamage 暴击伤害
   * @param config.chargeRate 充能效率
   * @param config.equippedSkill 已装备的技能
   */
  constructor(config: CharacterConfig) {
    const {
      name,
      id,
      maxHp = 100,
      maxMp = 100,
      attack = 10,
      defense = 5,
      critRate = 0.1,
      critDamage = 1.5,
      chargeRate = 1.0,
      equippedSkill,
    } = config;

    this.name = name;
    this.id = id;
    this._hp = maxHp;
    this._mp = maxMp;
    this._equippedSkill = equippedSkill;
    this._inventory = new Inventory();
    this.buffManager = new BuffManager(this);

    // 初始化基础属性
    this.baseStats[StatType.MAX_HP] = maxHp;
    this.baseStats[StatType.MAX_MP] = maxMp;
    this.baseStats[StatType.ATTACK] = attack;
    this.baseStats[StatType.DEFENSE] = defense;
    this.baseStats[StatType.CRIT_RATE] = critRate;
    this.baseStats[StatType.CRIT_DAMAGE] = critDamage;
    this.baseStats[StatType.CHARGE_RATE] = chargeRate;
  }

  public readonly name: string; // 角色名称
  public readonly id?: Monsters; // 角色ID

  // Getters - 属性访问器
  get hp(): number {
    return Math.floor(this._hp);
  }
  get mp(): number {
    return Math.floor(this._mp);
  }
  get maxHp(): number {
    return this.getStat(StatType.MAX_HP);
  }
  get maxMp(): number {
    return this.getStat(StatType.MAX_MP);
  }
  get exp(): number {
    return this._exp;
  }
  get level(): number {
    return this._level;
  }
  get attack(): number {
    return this.getStat(StatType.ATTACK);
  }
  get defense(): number {
    return this.getStat(StatType.DEFENSE);
  }
  get critRate(): number {
    return this.getStat(StatType.CRIT_RATE);
  }
  get critDamage(): number {
    return this.getStat(StatType.CRIT_DAMAGE);
  }
  get chargeRate(): number {
    return this.getStat(StatType.CHARGE_RATE);
  }
  get charge(): number {
    return this._charge;
  }
  get equippedSkill(): Skill | undefined {
    return this._equippedSkill;
  }
  get expNeeded(): number {
    return this.calculateExpNeeded();
  }
  get inventory(): Inventory {
    return this._inventory;
  }
  get equippedItems(): Readonly<Partial<Record<GearSlot, GearItem>>> {
    return this._equippedItems;
  }

  /**
   * 获取指定槽位的装备
   * @param slot 装备槽位
   * @returns ����品，如果位为空则返回 undefined
   */
  getEquippedItem(slot: GearSlot): GearItem | undefined {
    return this._equippedItems[slot];
  }

  /**
   * 检查指定槽位是否已装备物品
   * @param slot 装备槽位
   * @returns 是否已装备
   */
  hasEquippedItem(slot: GearSlot): boolean {
    return !!this._equippedItems[slot];
  }

  /**
   * 获取所有已装备物品的列表
   * @returns 已装备物品的数组
   */
  getAllEquippedItems(): GearItem[] {
    return Object.values(this._equippedItems).filter(
      (item): item is GearItem => !!item
    );
  }

  /**
   * 设置生命值，确保在0到最大生命值之间
   */
  set hp(value: number) {
    this._hp = Math.max(0, Math.min(value, this.maxHp));
    this.notifyStateChange();
  }

  /**
   * 设置魔法值，确保在0到最大魔法值之间
   */
  set mp(value: number) {
    this._mp = Math.max(0, Math.min(value, this.maxMp));
    this.notifyStateChange();
  }

  /**
   * 装备技能
   * @param skill 要装备的技能对象
   */
  equipSkill(skill: Skill | undefined) {
    this._equippedSkill = skill;
    this.notifyStateChange();
  }

  /**
   * 获得经验值并检查否升级
   * @param amount 获得的经验值数量
   */
  gainExp(amount: number) {
    this._exp += amount;
    console.log("gainExp", this._exp);
    this.notifyStateChange();
    this.checkLevelUp();
  }

  /**
   * 计算升级���需经验值
   * 1-20级：基础经验 = 等级 * 100
   * 21-40级：基础经验 = 等级 * 150 * (1 + (等级-20) * 0.1)
   * 41-60级：基础经验 = 等级 * 200 * (1 + (等级-40) * 0.15)
   * 60级以上：基础经 = 等级 * 300 * (1 + (等级-60) * 0.2)
   */
  private calculateExpNeeded(): number {
    const level = this.level;

    if (level <= 20) {
      return level * 100;
    } else if (level <= 40) {
      return Math.floor(level * 150 * (1 + (level - 20) * 0.1));
    } else if (level <= 60) {
      return Math.floor(level * 200 * (1 + (level - 40) * 0.15));
    } else {
      return Math.floor(level * 300 * (1 + (level - 60) * 0.2));
    }
  }

  /**
   * 检查是否满升级条件
   */
  private checkLevelUp() {
    const expNeeded = this.calculateExpNeeded();
    if (this._exp >= expNeeded) {
      this._exp -= expNeeded;
      this.levelUp();
      this.notifyStateChange();
      // 升级后继续检查是否可以再次升级
      this.checkLevelUp();
    }
  }

  /**
   * 角色升级
   * 根据不同等级段提升不同属性值
   */
  private levelUp() {
    this._level++;

    // 根据等级提升属性
    if (this.level <= 20) {
      this.baseStats[StatType.MAX_HP] += 15;
      this.baseStats[StatType.MAX_MP] += 8;
      this.baseStats[StatType.ATTACK] += 3;
      this.baseStats[StatType.DEFENSE] += 2;
    } else if (this.level <= 40) {
      this.baseStats[StatType.MAX_HP] += 12;
      this.baseStats[StatType.MAX_MP] += 6;
      this.baseStats[StatType.ATTACK] += 2;
      this.baseStats[StatType.DEFENSE] += 1.5;
    } else if (this.level <= 60) {
      this.baseStats[StatType.MAX_HP] += 10;
      this.baseStats[StatType.MAX_MP] += 5;
      this.baseStats[StatType.ATTACK] += 1.5;
      this.baseStats[StatType.DEFENSE] += 1;
    } else {
      this.baseStats[StatType.MAX_HP] += 8;
      this.baseStats[StatType.MAX_MP] += 4;
      this.baseStats[StatType.ATTACK] += 1;
      this.baseStats[StatType.DEFENSE] += 0.8;
    }

    // 恢复满状态
    this._hp = this.baseStats[StatType.MAX_HP];
    this._mp = this.baseStats[StatType.MAX_MP];

    console.log(
      `${this.name} 级 ${
        this.level
      } 级��下一级需要 ${this.calculateExpNeeded()} 经验值`
    );

    // 状态变化通知已经在 hp 和 mp 的 setter 中处理
    this.notifyStateChange(); // 添加知以确保更新
  }

  /**
   * 增加充能值
   * @param amount 基础充能量（定为0.05）
   */
  addCharge(amount: number) {
    // 固定能量5%，受充能效率影响，上限100%
    this._charge = Math.min(
      1,
      this._charge + 0.05 * this.baseStats[StatType.CHARGE_RATE]
    );
    this.notifyStateChange();
  }

  /**
   * 使用技能
   * 检查技能是否可用并执行技能效果
   * @returns 技能是否使用成功
   */
  useSkill() {
    if (!this._equippedSkill) return false;
    if (this._charge < 1) return false; // 充能不足
    if (this._mp < this._equippedSkill.manaCost) return false; // 魔法不足

    // 执行技能效果
    if (this._equippedSkill.effects) {
      this._equippedSkill.effects.forEach((effect) => {
        switch (effect.type) {
          case SkillEffectType.HEAL:
            this.hp = Math.min(
              this.maxHp,
              this.hp + this.maxHp * (effect.value || 0)
            );
            break;
          case SkillEffectType.BUFF:
            if (effect.buff) {
              this.addBuff(effect.buff);
            }
            break;
          case SkillEffectType.DEBUFF:
            // 如果是debuff，应该应用到目标身上，这里需要战斗系统来处理
            break;
        }
      });
    }

    this.isUsingSkill = true;
    this._charge = 0; // 重置充能
    this._mp -= this._equippedSkill.manaCost;
    return true;
  }

  /**
   * 计算伤害值
   * @param baseDamage 基础伤害值
   * @returns 计算后的际伤害值和是否暴击
   */
  calculateDamage(baseDamage: number): { damage: number; isCrit: boolean } {
    const isCrit = Math.random() < this.baseStats[StatType.CRIT_RATE];
    // 确保基础伤害是数字
    const validBaseDamage = Number(baseDamage) || 0;
    // 计算最终伤害
    const damage =
      validBaseDamage * (isCrit ? this.baseStats[StatType.CRIT_DAMAGE] : 1);
    return {
      damage: Math.max(0, Math.round(damage)),
      isCrit,
    };
  }

  /**
   * 判断角色是否已被击败
   */
  get isDefeated(): boolean {
    return this._hp <= 0;
  }

  /**
   * 受到伤害
   * @param damage 受到的伤害值
   * @returns 包含实际伤害值和是否被击败的信息
   */
  takeDamage(damage: number, damageType: DamageType = DamageType.PHYSICAL) {
    // TODO: 区分物理伤害和魔法伤害
    // const actualDamage = Math.max(1, damage - this._defense);
    const finalDamage = Math.min(this._hp, damage);
    this.hp -= finalDamage;
    this.addCharge(finalDamage);
    this.notifyStateChange();

    return {
      damage: finalDamage,
      isDefeated: this.isDefeated,
    };
  }

  /**
   * 攻击目标
   * @param target 攻击标
   * @returns 造成的实际伤害值和是否暴击
   */
  attackTarget(target: Character) {
    const { damage, isCrit } = this.calculateDamage(
      this.baseStats[StatType.ATTACK]
    );
    const actualDamage = target.takeDamage(damage);
    this.addCharge(actualDamage.damage); // 造成伤害获得5%充能
    return {
      damage: actualDamage.damage,
      isCrit,
    };
  }

  /**
   * 添加状态变化回调函数
   * @param callback 回����数
   * @returns 用于移除回调的函数
   */
  setStateChangeCallback(callback: () => void) {
    this._stateChangeCallbacks.add(callback);
    return () => {
      this._stateChangeCallbacks.delete(callback);
    };
  }

  /**
   * 通知状态变化的方法
   * 使用防抖以避免过于频繁的更新
   */
  private notifyStateChange = (() => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        this._stateChangeCallbacks.forEach((callback) => callback());
      }, 16);
    };
  })();

  /**
   * 恢复保存的状态
   * @param state 要恢复的角色状态
   */
  public restoreState(state: {
    hp: number;
    mp: number;
    exp: number;
    level: number;
    charge: number;
  }): void {
    this._hp = state.hp;
    this._mp = state.mp;
    this._exp = state.exp;
    this._level = state.level;
    this._charge = state.charge;
    this.updateStats();
  }

  /**
   * 添加临时效果
   * @param id 效果ID
   * @param attribute 影响的属性
   * @param value 效果值
   * @param duration 持续时间
   */
  public addTemporaryEffect(
    id: string,
    attribute: keyof GearStats,
    value: number,
    duration: number
  ): void {
    this._temporaryEffects.set(id, { value, duration, attribute });
  }

  /**
   * 在每回合结束时更效果
   */
  public updateEffects(): void {
    for (const [id, effect] of this._temporaryEffects.entries()) {
      effect.duration--;
      if (effect.duration <= 0) {
        this._temporaryEffects.delete(id);
        GameSystem.getInstance().sendMessage(
          MessageType.COMBAT,
          `${id.split("_")[0]} 效果已结束`
        );
      }
    }
  }

  /**
   * 装备物品
   * @param item 要装备的物品
   * @returns 是否装备成功
   */
  equipItem(item: GearItem): boolean {
    // 检查物品是否存在于背包中
    if (!this._inventory.hasItem(item.id)) {
      console.log("背包中没有此物品！");
      return false;
    }

    const oldItem = this._equippedItems[item.slot];
    if (oldItem) {
      // 将原装备放背包
      this._inventory.addItem(oldItem);
    }

    // 从背包中移除新装备
    this._inventory.removeItem(item.id);

    // 装备新物
    this._equippedItems[item.slot] = item;
    this.updateStats();

    console.log(`成功装备 ${item.name}`);
    this.notifyStateChange();
    return true;
  }

  /**
   * 卸下装备
   * @param slot 要卸下的装备槽位
   * @returns 是否卸下成功
   */
  unequipItem(slot: GearSlot): boolean {
    const item = this._equippedItems[slot];
    if (item) {
      // 将物品放回背包
      this._inventory.addItem(item);
      delete this._equippedItems[slot];
      this.updateStats();
      this.notifyStateChange();
      console.log(`成功卸下 ${item.name}`);
      return true;
    }
    return false;
  }

  /** 通知态变化 */
  protected updateState(): void {
    this.notifyStateChange();
  }

  /**
   * 使用消耗品
   * @param item 要使用的消耗品
   * @returns 是否使用成功
   */
  public useConsumable(item: ConsumableItem): boolean {
    // 应用每个效果
    item.effects.forEach((effect) => {
      switch (effect.type) {
        case ConsumableEffectType.HEAL_HP:
          this.hp += effect.value;
          GameSystem.getInstance().sendMessage(
            MessageType.COMBAT,
            `${this.name} 恢复了 ${effect.value} 点生命值`
          );
          break;

        case ConsumableEffectType.HEAL_MP:
          this.mp += effect.value;
          GameSystem.getInstance().sendMessage(
            MessageType.COMBAT,
            `${this.name} 恢复了 ${effect.value} 魔法值`
          );
          break;

        case ConsumableEffectType.RANDOM_EFFECT:
          const isPositive = Math.random() >= 0.5;
          if (isPositive) {
            // 正面：恢复生命值
            const healAmount = effect.value;
            this.hp += healAmount;
            GameSystem.getInstance().sendMessage(
              MessageType.COMBAT,
              `命运硬币显示正面！${this.name} 恢复了 ${healAmount} 点生命值`
            );
          } else {
            // 反面：受到伤害
            const damageAmount = Math.floor(effect.value * 0.5); // 伤害值为治疗值的一半
            this.takeDamage(damageAmount);
            GameSystem.getInstance().sendMessage(
              MessageType.COMBAT,
              `命运硬币显示反面！${this.name} 受到了 ${damageAmount} 点诅咒伤害`
            );
          }
          break;

        case ConsumableEffectType.BUFF_ATTACK:
          const attackBuff = effect.isPercentage
            ? this.attack * effect.value
            : effect.value;

          if (effect.duration) {
            // 添加临时效果
            this.addTemporaryEffect(
              `${item.id}_attack`,
              StatType.ATTACK, // 修复之前的错误，使用 StatType
              attackBuff,
              effect.duration
            );
            GameSystem.getInstance().sendMessage(
              MessageType.COMBAT,
              `${this.name} 的攻击力提升了！持续 ${effect.duration} 回合`
            );
          }
          break;

        // ... 处理其他效果类型
      }
    });

    return true;
  }

  /** 修改基础属性 */
  public setBaseStat(statType: StatType, value: number): void {
    this.baseStats[statType] = value;
    this.updateStats();
  }

  /** 获取基础属性值 */
  public getBaseStat(stat: StatType): number {
    return this.baseStats[stat];
  }

  /** 获取所有基础属性 */
  public getAllBaseStats(): Record<StatType, number> {
    return { ...this.baseStats };
  }

  /** 设置所有基础属性 */
  public setAllBaseStats(stats: Record<StatType, number>): void {
    Object.entries(stats).forEach(([stat, value]) => {
      this.baseStats[stat as StatType] = value;
    });
    this.updateStats();
  }

  /** 获取加成属性值 */
  public getBonusStat(stat: StatType): number {
    return this.bonusStats[stat];
  }

  /** 获取最终属性（基础+加成） */
  public getStat(stat: StatType): number {
    return this.getBaseStat(stat) + this.getBonusStat(stat);
  }

  /** 设置加成属性值 */
  protected setBonusStat(stat: StatType, value: number): void {
    this.bonusStats[stat] = value;
    this.updateStats();
  }

  public heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.notifyStateChange();
  }

  /** 更新buff状态 */
  private updateBuffs() {
    // 更新buff持续时间
    this.buffs = this.buffs.filter((buff) => {
      buff.duration--;
      return buff.duration > 0;
    });

    this.updateStats();
  }

  /** 更新属性 */
  private updateStats(): void {
    // 重置加成属性
    Object.keys(this.bonusStats).forEach((key) => {
      this.bonusStats[key as StatType] = 0;
    });

    // 应用装备加成
    for (const [slot, item] of Object.entries(this._equippedItems)) {
      if (item && item.stats) {
        for (const [stat, value] of Object.entries(item.stats)) {
          this.bonusStats[stat as StatType] += value;
        }
      }
    }

    // 应用buff效果
    for (const buff of this.buffManager.getActiveBuffs()) {
      if (buff.stat) {
        const addValue = buff.isPercentage
          ? this.getBaseStat(buff.stat) * buff.value
          : buff.value;
        this.bonusStats[buff.stat] += addValue;
      }
    }

    this.notifyStateChange();
  }

  /** 添加buff */
  public addBuff(buff: Buff): void {
    this.buffManager.addBuff(buff);
    this.updateStats();
  }

  /** 更新状态 */
  public onTurnEnd(): void {
    this.buffManager.update();
    this.updateStats();
    this.updateEffects();
  }

  /** 添加状态���果 */
  public addStatus(status: string): void {
    this.statusEffects.add(status);
  }

  /** 移除状态效果 */
  public removeStatus(status: string): void {
    this.statusEffects.delete(status);
  }

  /** 检查是否有某个���态 */
  public hasStatus(status: string): boolean {
    return this.statusEffects.has(status);
  }

  /** 直接装备物品（用于加载存档） */
  public restoreEquipment(slot: GearSlot, item: GearItem): void {
    this._equippedItems[slot] = item;
    this.updateStats();
  }
}
