/**
 * 装备属性类型
 * @description 定义所有可能的装备属性类型
 */
export enum StatType {
    /** 攻击力 */
    ATTACK = 'ATTACK',
    /** 防御力 */
    DEFENSE = 'DEFENSE',
    /** 当前生命值 */
    HP = 'HP',
    /** 最大生命值 */
    MAX_HP = 'MAX_HP',
    /** 当前魔法值 */
    MP = 'MP',
    /** 最大魔法值 */
    MAX_MP = 'MAX_MP', 
    /** 暴击率 */
    CRIT_RATE = 'CRIT_RATE',
    /** 暴击伤害 */
    CRIT_DAMAGE = 'CRIT_DAMAGE',
    /** 充能效率 */
    CHARGE_RATE = 'CHARGE_RATE',
    /** 追加伤害 */
    BONUS_DAMAGE = 'BONUS_DAMAGE',
    /** 法术亲和 */
    SPELL_AFFINITY = 'SPELL_AFFINITY',
    /** 最终减伤 */
    DAMAGE_REDUCTION = 'DAMAGE_REDUCTION',
    /** 魔法抗性 */
    MAGIC_RESISTANCE = 'MAGIC_RESISTANCE',
}

/**
 * 装备属性显示配置
 * @description 定义每种属性的显示名称和格式化方法
 */
export const STAT_CONFIG = {
    [StatType.ATTACK]: {
        name: '攻击力',
        description: '角色在无视防御时造成的伤害值',
        format: (value: number) => `${Math.floor(value)}`,
    },
    [StatType.DEFENSE]: {
        name: '防御力',
        description: '角色在受到伤害时减少的伤害值',
        format: (value: number) => `${Math.floor(value)}`,
    },
    [StatType.HP]: {
        name: '当前生命值',
        description: '角色的当前生命值',
        format: (value: number) => `${Math.floor(value)}`,
    },
    [StatType.MP]: {
        name: '当前魔法值',
        description: '角色的当前魔法值',
        format: (value: number) => `${Math.floor(value)}`,
    },
    [StatType.MAX_HP]: {
        name: '最大生命值',
        description: '角色的生命上限',
        format: (value: number) => `${Math.floor(value)}`,
    },
    [StatType.MAX_MP]: {
        name: '最大魔法值',
        description: '角色的魔法上限',
        format: (value: number) => `${Math.floor(value)}`,
    },
    [StatType.CRIT_RATE]: {
        name: '暴击率',
        description: '角色产生暴击的概率，上限为 100%',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    [StatType.CRIT_DAMAGE]: {
        name: '暴击伤害',
        description: '暴击时造成的伤害倍率',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    [StatType.CHARGE_RATE]: {
        name: '充能效率',
        description: '角色技能充能的效率，默认为5%',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    [StatType.BONUS_DAMAGE]: {
        name: '追加伤害',
        description: '角色在造成伤害时，按比例提升的伤害量',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    [StatType.SPELL_AFFINITY]: {
        name: '法术亲和',
        description: '角色在施放技能时，按比例提升伤害量',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    [StatType.DAMAGE_REDUCTION]: {
        name: '最终减伤',
        description: '角色在受到伤害时，按比例减少的伤害量',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    [StatType.MAGIC_RESISTANCE]: {
        name: '魔法抗性',
        description: '角色在受到来自技能的伤害时，按比例减少的伤害量',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
} as const;

/**
 * 获取属性显示名称
 * @param statType 属性类型
 * @returns 属性的中文显示名称
 */
export function getStatName(statType: StatType): string {
    return STAT_CONFIG[statType].name;
}

/**
 * 格式化属性值
 * @param statType 属性类型
 * @param value 属性值
 * @returns 格式化后的属性值字符串
 */
export function formatStatValue(statType: StatType, value: number): string {
    return STAT_CONFIG[statType].format(value);
}

/**
 * 属性值显示
 * @param statType 属性类型
 * @param value 属性值
 * @returns 完整的属性显示字符串
 */
export function getStatDisplay(statType: StatType, value: number): string {
    return `${getStatName(statType)} +${formatStatValue(statType, value)}`;
} 