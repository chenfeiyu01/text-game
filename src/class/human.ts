import { Skill } from "../constants/skill-list";

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
    private _onStateChange?: () => void;

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
        this._attack = attack;
        this._defense = defense;
        this._critRate = critRate;
        this._critDamage = critDamage;
        this._chargeRate = chargeRate;
        this._equippedSkill = equippedSkill;

        this._hp = maxHp;
        this._mp = maxMp;
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
    get attack(): number { return this._attack; }
    get defense(): number { return this._defense; }
    get critRate(): number { return this._critRate; }
    get critDamage(): number { return this._critDamage; }
    get chargeRate(): number { return this._chargeRate; }
    get charge(): number { return this._charge; }
    get equippedSkill(): Skill | undefined { return this._equippedSkill; }

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
        this.checkLevelUp();
    }

    /**
     * 检查是否满足升级条件
     * 当经验值达到要求时触发升级
     */
    private checkLevelUp() {
        const expNeeded = this.level * 100; // 简单的等级经验计算公式
        if (this._exp >= expNeeded) {
            this._exp -= expNeeded;
            this.levelUp();
        }
    }

    /**
     * 角色升级
     * 提升各项属性并恢复状态
     */
    private levelUp() {
        this._level++;
        this._maxHp += 10;
        this._maxMp += 5;
        this._attack += 2;
        this._defense += 1;
        this._hp = this._maxHp;
        this._mp = this._maxMp;

        console.log(`${this.name} 升级到 ${this.level} 级！`);
        this.notifyStateChange();
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
            经验值: ${this.exp}
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
        this._onStateChange = callback;
    }

    // 在所有修改状态的方法中调用回调
    private notifyStateChange() {
        if (this._onStateChange) {
            this._onStateChange();
        }
    }
}
