import { CharacterState } from "../constants/character";
import { MessageType } from "../constants/game-system";
import { GearStats, GearItem, GearSlot, ConsumableItem, ConsumableEffectType } from "../constants/item";
import { Monsters } from "../constants/monsters";
import { Skill } from "../constants/skill-list";
import { GameSystem } from "./game-system";
import { Inventory } from './inventory';
import { StatType } from '../constants/stats';

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
 * 包含角色的基本属性和战斗相关的方法
 * 
 * @description
 * 主要功能:
 * - 管理角色基础属性(生命值、魔法值、攻击力等)
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
    /** 角色背包系统 */
    protected _inventory: Inventory;
    /** 临时效果集合 */
    private _temporaryEffects: Map<string, {
        /** 效果数值 */
        value: number;
        /** 持续时间 */
        duration: number;
        /** 影响的属性 */
        attribute: keyof GearStats;
    }> = new Map();
    /** 已装备的物品 */
    private _equippedItems: Partial<Record<GearSlot, GearItem>> = {};

    /** 基础属性（不受装备影响的初始值） */
    /** 基础攻击力 */
    protected baseAttack: number;
    /** 基础防御力 */
    protected baseDefense: number;
    /** 基础暴击率 */
    protected baseCritRate: number;
    /** 基础暴击伤害 */
    protected baseCritDamage: number;

    /** 角色属性 */
    public stats: Partial<Record<StatType, number>> = {};
    
    /** 是否正在使用技能 */
    public isUsingSkill: boolean = false;

    public buffs: { stat: StatType; value: number; duration: number; }[] = [];

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
            equippedSkill
        } = config;

        this.name = name;
        this.id = id;
        this._maxHp = maxHp;
        this._maxMp = maxMp;
        this.baseAttack = attack;
        this.baseDefense = defense;
        this.baseCritRate = critRate;
        this.baseCritDamage = critDamage;
        this._chargeRate = chargeRate;
        this._equippedSkill = equippedSkill;

        this._hp = maxHp;
        this._mp = maxMp;
        this._inventory = new Inventory();

        this._attack = this.baseAttack;
        this._defense = this.baseDefense;
        this._critRate = this.baseCritRate;
        this._critDamage = this.baseCritDamage;

        // 初始化基础属性到 stats
        this.stats = {
            [StatType.ATTACK]: this.baseAttack,
            [StatType.DEFENSE]: this.baseDefense,
            [StatType.CRIT_RATE]: this.baseCritRate,
            [StatType.CRIT_DAMAGE]: this.baseCritDamage,
            [StatType.CHARGE_RATE]: this._chargeRate,
            [StatType.MAX_HP]: this._maxHp,
            [StatType.MAX_MP]: this._maxMp,
            [StatType.BONUS_DAMAGE]: 0,
            [StatType.SPELL_AFFINITY]: 0,
            [StatType.DAMAGE_REDUCTION]: 0,
            [StatType.MAGIC_RESISTANCE]: 0
        };
    }

    public readonly name: string;         // 角色名称
    public readonly id?: Monsters;         // 角色ID
    private _maxHp: number;               // 最大生命值
    private _maxMp: number;               // 最大魔法值
    private _attack: number;              // 攻击力
    private _defense: number;             // 防御力
    private _critRate: number;            // 暴击率
    private _critDamage: number;          // 暴击伤害
    private _chargeRate: number;          // 充能效率
    private _equippedSkill?: Skill | undefined;       // 已装备的技能

    // Getters - 属性访问器
    get hp(): number { return this._hp; }
    get mp(): number { return this._mp; }
    get maxHp(): number { return this._maxHp; }
    get maxMp(): number { return this._maxMp; }
    get exp(): number { return this._exp; }
    get level(): number { return this._level; }
    get attack(): number { return this.getStat(StatType.ATTACK); }
    get defense(): number { return this.getStat(StatType.DEFENSE); }
    get critRate(): number { return this.getStat(StatType.CRIT_RATE); }
    get critDamage(): number { return this.getStat(StatType.CRIT_DAMAGE); }
    get chargeRate(): number { return this.getStat(StatType.CHARGE_RATE); }
    get charge(): number { return this._charge; }
    get equippedSkill(): Skill | undefined { return this._equippedSkill; }
    get expNeeded(): number { return this.calculateExpNeeded(); }
    get inventory(): Inventory {
        return this._inventory;
    }
    get equippedItems(): Readonly<Partial<Record<GearSlot, GearItem>>> {
        return this._equippedItems;
    }

    /**
     * 获取指定槽位的装备
     * @param slot 装备槽位
     * @returns 装备物品，如果槽位为空则返回 undefined
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
        return Object.values(this._equippedItems).filter((item): item is GearItem => !!item);
    }

    /**
     * 设置生命值，确保在0到最大生命值之间
     */
    set hp(value: number) {
        this._hp = Math.max(0, Math.min(value, this._maxHp));
        this.notifyStateChange();
    }

    /**
     * 设置魔法值，确保在0到最大魔法值之间
     */
    set mp(value: number) {
        this._mp = Math.max(0, Math.min(value, this._maxMp));
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
     * 获得经验值并检查是否升级
     * @param amount 获得的经验值数量
     */
    gainExp(amount: number) {
        this._exp += amount;
        console.log('gainExp', this._exp)
        this.notifyStateChange();
        this.checkLevelUp();
    }

    /**
     * 计算升级所需经验值
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
     * 检查是否满足升级条件
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

        // 根据等级段提升属性
        if (this.level <= 20) {
            this._maxHp += 15;
            this._maxMp += 8;
            this._attack += 3;
            this._defense += 2;
        } else if (this.level <= 40) {
            this._maxHp += 12;
            this._maxMp += 6;
            this._attack += 2;
            this._defense += 1.5;
        } else if (this.level <= 60) {
            this._maxHp += 10;
            this._maxMp += 5;
            this._attack += 1.5;
            this._defense += 1;
        } else {
            this._maxHp += 8;
            this._maxMp += 4;
            this._attack += 1;
            this._defense += 0.8;
        }

        // 恢复满状态
        this._hp = this._maxHp;
        this._mp = this._maxMp;

        console.log(`${this.name} 升级到 ${this.level} 级！下一级需要 ${this.calculateExpNeeded()} 经验值`);

        // 状态变化通知已经在 hp 和 mp 的 setter 中处理
        this.notifyStateChange();  // 添加通知以确保更新
    }

    /**
     * 增加充能值
     * @param amount 基础充能量（固定为5%）
     */
    addCharge(amount: number) {
        // 固定充能量5%，受充能效率影响，上限100%
        this._charge = Math.min(100, this._charge + 5 * this._chargeRate);
        this.notifyStateChange();
    }

    /**
     * 使用技能
     * 检查技能是否可用并执行技能效果
     * @returns 技能是否使用成功
     */
    useSkill(): boolean {
        if (!this._equippedSkill) {
            console.log('未装备技能！');
            return false;
        }

        if (this._charge < this._equippedSkill.chargeCost) {
            console.log('充能不足！');
            return false;
        }

        if (this._mp < this._equippedSkill.manaCost) {
            console.log('魔法值不足！');
            return false;
        }

        // 使用技能
        this._mp -= this._equippedSkill.manaCost;
        this._charge -= this._equippedSkill.chargeCost;

        // 执行技能效果
        if (this._equippedSkill.effect) {
            this._equippedSkill.effect(this);
        }

        console.log(`${this.name} 使用了 ${this._equippedSkill.name}！`);
        this.notifyStateChange();
        return true;
    }

    /**
     * 计算伤害值
     * @param baseDamage 基础伤害值
     * @returns 计算后的实际伤害值和是否暴击
     */
    calculateDamage(baseDamage: number): { damage: number, isCrit: boolean } {
        const isCrit = Math.random() < this._critRate;
        // 确保基础伤害是数字
        const validBaseDamage = Number(baseDamage) || 0;
        // 计算最终伤害
        const damage = validBaseDamage * (isCrit ? this._critDamage : 1);
        return {
            damage: Math.max(0, Math.round(damage)),
            isCrit
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
    takeDamage(damage: number) {
        // const actualDamage = Math.max(1, damage - this._defense);
        const finalDamage = Math.min(this._hp, damage);
        this.hp -= finalDamage;
        this.addCharge(finalDamage);
        this.notifyStateChange();

        return {
            damage: finalDamage,
            isDefeated: this.isDefeated
        };
    }

    /**
     * 攻击目标
     * @param target 攻击目标
     * @returns 造成的实际伤害值和是否暴击
     */
    attackTarget(target: Character) {
        const { damage, isCrit } = this.calculateDamage(this._attack);
        const actualDamage = target.takeDamage(damage);
        this.addCharge(actualDamage.damage); // 造成伤害获得5%充能
        return {
            damage: actualDamage.damage,
            isCrit
        };
    }

    /**
     * 获取角色当前状态信息
     * @returns 包含所有属性的状态字符串
     */
    getStatus(): string {
        return `
            名称: ${this.name}
            等级: ${this.level}
            经验值: ${this.exp}/${this.expNeeded}
            生命值: ${this.hp}/${this.maxHp}
            魔法值: ${this.mp}/${this.maxMp}
            攻击力: ${this.attack}
            防御力: ${this.defense}
            暴击率: ${(this.critRate * 100).toFixed(1)}%
            暴击伤害: ${(this.critDamage * 100).toFixed(1)}%
            充能: ${this.charge.toFixed(1)}%
            装备技能: ${this.equippedSkill?.name || '无'}
        `;
    }

    /**
     * 添加状态变化回调函数
     * @param callback 回调函数
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
                this._stateChangeCallbacks.forEach(callback => callback());
            }, 16);
        };
    })();

    /**
     * 恢复保存的状态
     * @param state 要恢复的角色状态
     */
    public restoreState(state: CharacterState): void {
        this._level = state.level;
        this._exp = state.exp;
        this._hp = state.hp;
        this._mp = state.mp;
        this._attack = state.attack;
        this._defense = state.defense;
        this._critRate = state.critRate;
        this._critDamage = state.critDamage;
        this._chargeRate = state.chargeRate;
        
        this.notifyStateChange();
    }

    /**
     * 获取实际属性值（包含临时效果）
     * @param attribute 属性名
     * @returns 计算后的属性值
     */
    public getEffectiveAttribute(attribute: keyof GearStats): number {
        // TODO: 现在没有做 buff 相关
        // @ts-ignore
        let baseValue = this[attribute] || 0;
        this._temporaryEffects.forEach(effect => {
            if (effect.attribute === attribute) {
                baseValue += effect.value;
            }
        });
        return baseValue;
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
                    `${id.split('_')[0]} 效果已结束`
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
            console.log('背包中没有此物品！');
            return false;
        }

        const oldItem = this._equippedItems[item.slot];
        if (oldItem) {
            // 将原装备放回背包
            this._inventory.addItem(oldItem);
        }

        // 从背包中移除新装备
        this._inventory.removeItem(item.id);
        
        // 装备新物品
        this._equippedItems[item.slot] = item;
        this.updateAttributes();
        
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
            this.updateAttributes();
            this.notifyStateChange();
            console.log(`成功卸下 ${item.name}`);
            return true;
        }
        return false;
    }

    /**
     * 更新角色属性
     * 重新计算所有受装备影响的属性值
     */
    private updateAttributes(): void {
        // Reset attributes to base values
        this._attack = this.baseAttack;
        this._defense = this.baseDefense;
        this._critRate = this.baseCritRate;
        this._critDamage = this.baseCritDamage;

        // Add attributes from equipped items
        for (const item of Object.values(this._equippedItems)) {
            if (item) {
                this._attack += item.stats[StatType.ATTACK] || 0;
                this._defense += item.stats[StatType.DEFENSE] || 0;
                this._critRate += item.stats[StatType.CRIT_RATE] || 0;
                this._critDamage += item.stats[StatType.CRIT_DAMAGE] || 0;
            }
        }
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
        item.effects.forEach(effect => {
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
                        `${this.name} 恢复了 ${effect.value} 点魔法值`
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
                            StatType.ATTACK,  // 修复之前的错误，使用 StatType
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
        switch(statType) {
            case StatType.ATTACK:
                this.baseAttack = value;
                break;
            case StatType.DEFENSE:
                this.baseDefense = value;
                break;
            case StatType.CRIT_RATE:
                this.baseCritRate = value;
                break;
            case StatType.CRIT_DAMAGE:
                this.baseCritDamage = value;
                break;
        }
        this.updateAttributes();
        this.notifyStateChange();
    }

    public getBaseStat(statType: StatType): number {
        switch(statType) {
            case StatType.ATTACK:
                return this.baseAttack;
            case StatType.DEFENSE:
                return this.baseDefense;
            case StatType.CRIT_RATE:
                return this.baseCritRate;
            case StatType.CRIT_DAMAGE:
                return this.baseCritDamage;
            default:
                return 0;
        }
    }

    public addBuff(stat: StatType, value: number, duration: number) {
        this.buffs.push({ stat, value, duration });
        this.updateStats();
    }

    public heal(amount: number) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        this.notifyStateChange();
    }

    private updateStats() {
        // 重置基础属性
        this.stats[StatType.ATTACK] = this.baseAttack;
        this.stats[StatType.DEFENSE] = this.baseDefense;
        this.stats[StatType.CRIT_RATE] = this.baseCritRate;
        this.stats[StatType.CRIT_DAMAGE] = this.baseCritDamage;
        this.stats[StatType.CHARGE_RATE] = this._chargeRate;

        // 应用装备加成
        for (const item of Object.values(this._equippedItems)) {
            if (item) {
                Object.entries(item.stats).forEach(([stat, value]) => {
                    this.stats[stat as StatType] = (this.stats[stat as StatType] || 0) + value;
                });
            }
        }

        // 应用buff效果
        this.buffs.forEach(buff => {
            if (buff.duration > 0) {
                this.stats[buff.stat] = (this.stats[buff.stat] || 0) + buff.value;
            }
        });

        this.notifyStateChange();
    }

    /**
     * 通过属性类型获取属性值
     */
    public getStat(statType: StatType): number {
        return this.stats[statType] || (() => {
            switch (statType) {
                case StatType.MAX_HP:
                    return this._maxHp;
                case StatType.MAX_MP:
                    return this._maxMp;
                case StatType.ATTACK:
                    return this.baseAttack;
                case StatType.DEFENSE:
                    return this.baseDefense;
                case StatType.CRIT_RATE:
                    return this.baseCritRate;
                case StatType.CRIT_DAMAGE:
                    return this.baseCritDamage;
                case StatType.CHARGE_RATE:
                    return this._chargeRate;
                default:
                    return 0;
            }
        })();
    }
}
