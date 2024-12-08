import { STAT_CONFIG, StatType } from "./stats";
import { Character } from "../class/character";
import { DamageType, DamageTypeNames } from "./skill-list";

/** Buff来源类型 */
export enum BuffSourceType {
    /** 事件buff */
    EVENT = 'EVENT',
    /** 装备buff */
    GEAR = 'GEAR',
    /** 技能buff */
    SKILL = 'SKILL',
    /** 消耗品buff */
    CONSUMABLE = 'CONSUMABLE'
}

/** Buff类型 */
export enum BuffType {
    /** 属性增益 */
    ATTRIBUTE = 'ATTRIBUTE',
    /** 状态效果 */
    STATUS = 'STATUS',
    /** 特殊效果 */
    SPECIAL = 'SPECIAL'
}

/** Buff效果接口 */
export interface Buff {
    /** buff唯一ID */
    id: string;
    /** buff名称 */
    name: string;
    /** buff描述 */
    description: string;
    /** buff来源 */
    source: BuffSourceType;
    /** buff类型 */
    type: BuffType;
    /** 影响的属性 */
    stat?: StatType;
    /** 效果数值 */
    value: number;
    /** 持续时间(回合) */
    duration: number;
    /** 是否为百分比加成 */
    isPercentage?: boolean;
    /** 特殊效果处理函数 */
    onApply?: (target: Character) => void;
    /** buff结束时的处理函数 */
    onRemove?: (target: Character) => void;
    /** 每回合执行的处理函数 */
    onTick?: (target: Character) => void;
}

/** Buff管理器 */
export class BuffManager {
    private buffs: Map<string, Buff> = new Map();
    private target: Character;

    constructor(target: Character) {
        this.target = target;
    }

    /** 添加buff */
    addBuff(buff: Buff): void {
        // 如果已存在同类型buff，先移除旧的
        if (buff.stat) {
            this.removeBuffsByStat(buff.stat);
        }
        this.buffs.set(buff.id, buff);

        if (buff.onApply) {
            buff.onApply(this.target);
        }
    }

    /** 移除buff */
    removeBuff(buffId: string): void {
        const buff = this.buffs.get(buffId);
        if (buff && buff.onRemove) {
            buff.onRemove(this.target);
        }
        this.buffs.delete(buffId);
    }

    /** 移除指定属性的所有buff */
    removeBuffsByStat(stat: StatType): void {
        for (const [id, buff] of this.buffs.entries()) {
            if (buff.stat === stat) {
                this.removeBuff(id);
            }
        }
    }

    /** 获取所有生效中的buff */
    getActiveBuffs(): Buff[] {
        return Array.from(this.buffs.values());
    }

    /** 更新buff状态 */
    update(): void {
        for (const [id, buff] of this.buffs.entries()) {
            if (buff.onTick) {
                buff.onTick(this.target);
            }
            
            buff.duration--;
            if (buff.duration <= 0) {
                this.removeBuff(id);
            }
        }
    }
}

/** 创建技能buff的工厂函数 */
export function createSkillBuff(params: {
    id: string;
    name: string;
    description: string;
    stat?: StatType;
    value: number;
    duration: number;
    isPercentage?: boolean;
    onApply?: (target: Character) => void;
    onRemove?: (target: Character) => void;
    onTick?: (target: Character) => void;
}): Buff {
    return {
        ...params,
        source: BuffSourceType.SKILL,
        type: params.stat ? BuffType.ATTRIBUTE : BuffType.SPECIAL
    };
}

/** 常用技能buff创建函数 */
export const SkillBuffs = {
    /** 创建属性增益buff */
    createAttributeBuff(
        stat: StatType,
        value: number,
        duration: number,
        isPercentage: boolean = true
    ): Buff {
        return createSkillBuff({
            id: `skill_buff_${stat}_${Date.now()}`,
            name: `${STAT_CONFIG[stat].name}提升`,
            description: `提升${STAT_CONFIG[stat].name}${value * (isPercentage ? 100 : 1)}${isPercentage ? '%' : '点'}`,
            stat,
            value,
            duration,
            isPercentage
        });
    },

    /** 创建持续伤害buff */
    createDotBuff(
        damage: number,
        duration: number,
        damageType: DamageType = DamageType.PHYSICAL
    ): Buff {
        return createSkillBuff({
            id: `dot_${Date.now()}`,
            name: '持续伤害',
            description: `每回合受到${damage}点${DamageTypeNames[damageType]}`,
            value: damage,
            duration,
            onTick: (target) => {
                target.takeDamage(damage, damageType);
            }
        });
    },

    /** 创建眩晕buff */
    createStunBuff(duration: number): Buff {
        return createSkillBuff({
            id: `stun_${Date.now()}`,
            name: '眩晕',
            description: `被眩晕${duration}回合，无法行动`,
            value: 0,
            duration,
            onApply: (target) => {
                target.addStatus('stunned');
            },
            onRemove: (target) => {
                target.removeStatus('stunned');
            }
        });
    }
}; 