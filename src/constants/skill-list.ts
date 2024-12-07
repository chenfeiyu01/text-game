import { StatType } from "./stats";

/** 伤害类型 */
export type DamageType = 'physical' | 'magic';

/** 技能类型 */
export enum SkillEffectType {
    /** 眩晕技能 */
    STUN = 'stun',
    
    /** 增益技能 */
    BUFF = 'buff',
    
    /** 减益技能 */
    DEBUFF = 'debuff',
    
    /** 治疗技能 */
    HEAL = 'heal',
    
    /** 必定暴击技能 */
    GUARANTEED_CRIT = 'guaranteed_crit'
}

/**
 * 技能效果接口
 * @interface
 * @property {('stun'|'buff'|'debuff'|'heal'|'guaranteed_crit')} type - 效果类型
 * @property {StatType} [stat] - 影响的属性类型
 * @property {number} [value] - 效果数值
 * @property {number} [duration] - 持续时间(回合)
 * @property {number} [chance] - 触发概率
 * @property {number} [defenseReduction] - 防御力降低百分比
 */
export interface SkillEffect {
    /** 效果类型 */
    type: SkillEffectType;
    /** 影响的属性类型 */
    stat?: StatType;
    /** 效果数值 */
    value?: number;
    /** 持续时间(回合) */
    duration?: number;
    /** 触发概率 */
    chance?: number;
    /** 防御力降低百分比 */
    defenseReduction?: number;
}

/**
 * 技能接口
 * @interface
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
}
