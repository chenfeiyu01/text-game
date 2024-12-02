import { CharacterState } from "../constants/character";
import { MessageType } from "../constants/game-system";
import { GearStats, GearItem, GearSlot } from "../constants/item";
import { Skill } from "../constants/skill-list";
import { GameSystem } from "./game-system";
import { Inventory } from './inventory';

/**
 * 角色类
 * 包含角色的基本属性和战斗相关的方法
 */
export class Character {
    private _hp: number;          // 当前生命值
    private _mp: number;          // 当前魔法值
    private _exp: number = 0;     // 当前经验值
    private _level: number = 1;   // 当前等级
    private _charge: number = 0;  // 当前充能值
    private _stateChangeCallbacks: Set<() => void> = new Set();
    protected _inventory: Inventory;
    private _temporaryEffects: Map<string, {
        value: number;
        duration: number;
        attribute: keyof GearStats;
    }> = new Map();
    private _equippedItems: Partial<Record<GearSlot, GearItem>> = {};

    // 基础属性（不受装备影响的初始值）
    protected baseAttack: number;
    protected baseDefense: number;
    protected baseCritRate: number;
    protected baseCritDamage: number;

    /**
     * 构造函数
     * @param config 角色配置对象
     */
    constructor(config: {
        name: string,
        maxHp?: number,
        maxMp?: number,
        attack?: number,
        defense?: number,
        critRate?: number,
        critDamage?: number,
        chargeRate?: number,
        equippedSkill?: Skill
    }) {
        const {
            name,
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
    }

    public readonly name: string;
    private _maxHp: number;
    private _maxMp: number;
    private _attack: number;
    private _defense: number;
    private _critRate: number;
    private _critDamage: number;
    private _chargeRate: number;
    private _equippedSkill?: Skill;

    // Getters - 属性访问器
    get hp(): number { return this._hp; }
    get mp(): number { return this._mp; }
    get maxHp(): number { return this._maxHp; }
    get maxMp(): number { return this._maxMp; }
    get exp(): number { return this._exp; }
    get level(): number { return this._level; }
    get attack(): number {
        let baseAttack = this._attack;
        this._temporaryEffects.forEach(effect => {
            if (effect.attribute === 'attack') {
                baseAttack += effect.value;
            }
        });
        return baseAttack;
    }
    get defense(): number { return this._defense; }
    get critRate(): number { return this._critRate; }
    get critDamage(): number { return this._critDamage; }
    get chargeRate(): number { return this._chargeRate; }
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
    equipSkill(skill: Skill) {
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
     * 60级以上：基础经验 = 等级 * 300 * (1 + (等级-60) * 0.2)
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
     * @returns 计算后的实际伤害值
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
     * @returns {Object} 包含实际伤害值和是否被击败的信息
     */
    takeDamage(damage: number) {
        const actualDamage = Math.max(1, damage - this._defense);
        const finalDamage = Math.min(this._hp, actualDamage);
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
     * @returns 造成的实际伤害值
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

    // 添加设置回调的方法
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

    // 获取实际属性值（包含临时效果）
    public getEffectiveAttribute(attribute: keyof GearStats): number {
        let baseValue = this[attribute] || 0;
        this._temporaryEffects.forEach(effect => {
            if (effect.attribute === attribute) {
                baseValue += effect.value;
            }
        });
        return baseValue;
    }

    // 添加临时效果
    public addTemporaryEffect(
        id: string,
        attribute: keyof GearStats,
        value: number,
        duration: number
    ): void {
        this._temporaryEffects.set(id, { value, duration, attribute });
    }

    // 在每回合结束时调用
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

    private updateAttributes(): void {
        // Reset attributes to base values
        this._attack = this.baseAttack;
        this._defense = this.baseDefense;
        this._critRate = this.baseCritRate;
        this._critDamage = this.baseCritDamage;

        // Add attributes from equipped items
        for (const item of Object.values(this._equippedItems)) {
            if (item) {
                this._attack += item.stats.attack || 0;
                this._defense += item.stats.defense || 0;
                this._critRate += item.stats.critRate || 0;
                this._critDamage += item.stats.critDamage || 0;
            }
        }
    }
}

