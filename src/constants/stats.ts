/**
 * 装备属性类型
 * @description 定义所有可能的装备属性类型
 */
export enum StatType {
    ATTACK = 'attack',           // 攻击力
    DEFENSE = 'defense',         // 防御力
    MAX_HP = 'maxHp',           // 最大生命值
    MAX_MP = 'maxMp',           // 最大魔法值
    CRIT_RATE = 'critRate',     // 暴击率
    CRIT_DAMAGE = 'critDamage', // 暴击伤害
    CHARGE_RATE = 'chargeRate', // 充能效率
}

/**
 * 装备属性显示配置
 * @description 定义每种属性的显示名称和格式化方法
 */
export const STAT_CONFIG = {
    [StatType.ATTACK]: {
        name: '攻击力',
        format: (value: number) => `${value}`,
    },
    [StatType.DEFENSE]: {
        name: '防御力',
        format: (value: number) => `${value}`,
    },
    [StatType.MAX_HP]: {
        name: '最大生命值',
        format: (value: number) => `${value}`,
    },
    [StatType.MAX_MP]: {
        name: '最大魔法值',
        format: (value: number) => `${value}`,
    },
    [StatType.CRIT_RATE]: {
        name: '暴击率',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    [StatType.CRIT_DAMAGE]: {
        name: '暴击伤害',
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
    },
    [StatType.CHARGE_RATE]: {
        name: '充能效率',
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