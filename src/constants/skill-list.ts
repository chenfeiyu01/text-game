import { StatType, STAT_CONFIG } from './stats';

import { Buff } from './buff';
import { DamageType } from './battle';

/** 技能类型 */
export enum SkillEffectType {
    /** 伤害效果 */
    DAMAGE = 'damage',
    /** 治疗效果 */
    HEAL = 'heal',
    /** 增益效果 */
    BUFF = 'buff',
    /** 减益效果 */
    DEBUFF = 'debuff',
    /** 持续伤害效果 */
    DOT = 'dot',
    /** 眩晕效果 */
    STUN = 'stun',
    /** 必定暴击效果 */
    GUARANTEED_CRIT = 'guaranteed_crit'
}

/**
 * 技能效果接口
 * @interface SkillEffect
 * @property {SkillEffectType} type - 效果类型
 * @property {number} [value] - 效果数值
 * @property {DamageType} [damageType] - 伤害类型
 * @property {StatType} [stat] - 影响的属性类型
 * @property {number} [duration] - 持续时间(回合)
 * @property {number} [chance] - 触发概率
 * @property {number} [defenseReduction] - 防御力降低百分比
 * @property {boolean} [isPercentage] - 是否为百分比值
 * @property {Buff} [buff] - Buff效果
 */
/** 技能效果接口 */
export interface SkillEffect {
    /** 效果类型 */
    type: SkillEffectType;
    /** 效果数值 */
    value?: number;
    /** 伤害类型 */
    damageType?: DamageType;
    /** 影响的属性类型 */
    stat?: StatType;
    /** 持续时间(回合) */
    duration?: number;
    /** 触发概率 */
    chance?: number;
    /** 防御力降低百分比 */
    defenseReduction?: number;
    /** 是否为百分比值 */
    isPercentage?: boolean;
    /** Buff效果 */
    buff?: Buff;
}

/**
 * 技能接口
 * @interface Skill
 * @property {string} id - 技能唯一标识
 * @property {string} name - 技能名称
 * @property {number} damage - 技能伤害值
 * @property {number} manaCost - 魔法消耗
 * @property {number} chargeCost - 充能消耗百分比
 * @property {string} description - 技能描述
 * @property {number} requiredLevel - 需求等级
 * @property {number} cost - 学习花费金币
 * @property {DamageType} damageType - 伤害类型
 * @property {number} [hitCount] - 攻击次数
 * @property {SkillEffect[]} [effects] - 技能效果列表
 * @property {() => string[]} getEffectDescriptions - 获取效果描述列表
 */
export interface Skill {
    /** 技能唯一标识 */
    id: string;
    /** 技能名称 */
    name: string;
    /** 技能伤害值 */
    damage: number;
    /** 魔法消耗 */
    manaCost: number;
    /** 充能消耗百分比 */
    chargeCost: number;
    /** 技能描述 */
    description: string;
    /** 需求等级 */
    requiredLevel: number;
    /** 学习花费金币 */
    cost: number;
    /** 伤害类型 */
    damageType: DamageType;
    /** 攻击次数 */
    hitCount?: number;
    /** 技能效果列表 */
    effects?: SkillEffect[];
    /** 获取效果描述列表 */
    getEffectDescriptions(): string[];
}

/**
 * 技能实现类
 * @class SkillImpl
 * @implements {Skill}
 */
export class SkillImpl implements Skill {
    /**
     * 创建一个技能实例
     * @param {string} id - 技能唯一标识
     * @param {string} name - 技能名称
     * @param {string} description - 技能描述
     * @param {SkillEffect[]} effects - 技能效果列表
     * @param {number} manaCost - 魔法消耗
     * @param {number} chargeCost - 充能消耗百分比
     * @param {number} cost - 学习花费金币
     * @param {number} requiredLevel - 需求等级
     * @param {number} damage - 技能伤害值
     * @param {DamageType} damageType - 伤害类型
     */
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public effects: SkillEffect[],
        public manaCost: number,
        public chargeCost: number,
        public cost: number,
        public requiredLevel: number,
        public damage: number,
        public damageType: DamageType,
    ) {}

    /**
     * 获取技能效果的描述列表
     * @returns {string[]} 效果描述列表
     */
    getEffectDescriptions(): string[] {
        return this.effects.map(effect => {
            let desc = '';
            
            switch (effect.type) {
                case SkillEffectType.DAMAGE:
                    desc = effect.isPercentage ? 
                        `造成 ${effect.value! * 100}% 攻击力的${effect.damageType === DamageType.PHYSICAL ? '物理' : '魔法'}伤害` :
                        `造成 ${effect.value} 点${effect.damageType === DamageType.PHYSICAL ? '物理' : '魔法'}伤害`;
                    break;
                case SkillEffectType.HEAL:
                    desc = `恢复 ${effect.value! * 100}% 最大生命值`;
                    break;
                case SkillEffectType.BUFF:
                case SkillEffectType.DEBUFF:
                    if (effect.buff) {
                        desc = effect.buff.description;
                        if (effect.buff.duration) {
                            desc += `${effect.buff.isPercentage ? effect.buff.value * 100 + '%' : effect.buff.value}，持续 ${effect.buff.duration} 回合`;
                        }
                    }
                    break;
                case SkillEffectType.DOT:
                    desc = `每回合造成 ${effect.value! * 100}% 攻击力的持续伤害，持续 ${effect.duration} 回合`;
                    break;
                case SkillEffectType.STUN:
                    desc = `${effect.chance ? effect.chance * 100 : 0}% 几率使目标眩晕 ${effect.duration} 回合`;
                    break;
                case SkillEffectType.GUARANTEED_CRIT:
                    desc = `必定暴击，无视目标 ${effect.defenseReduction! * 100}% 防御`;
                    break;
            }

            if (effect.chance && effect.chance < 1 && effect.type !== SkillEffectType.STUN) {
                desc += `（${effect.chance * 100}% 几率触发）`;
            }

            return desc;
        });
    }
}
