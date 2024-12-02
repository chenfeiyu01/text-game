import { NpcFunction } from './npc';
import { GearItem, Item } from './item';
import { Skill } from './skill-list';

// NPC基础配置接口
export interface NpcBaseConfig {
    id: string;
    name: string;
    description: string;
    functions: NpcFunction[];
    dialogs: Record<string, {
        id: string;
        text: string;
        options: Array<{
            text: string;
            nextDialogId?: string;
            action?: () => void;
        }>;
    }>;
    defaultDialogId: string;
}

// 商人NPC配置
export interface ShopNpcConfig extends NpcBaseConfig {
    goods: Item[];           // 商品列表
    buyRates?: Record<string, number>;   // 购买价格倍率
    sellRates?: Record<string, number>;  // 出售价格倍率
}

// 强化NPC配置
export interface EnhanceNpcConfig extends NpcBaseConfig {
    enhanceCostMultiplier?: number;  // 强化费用倍率
}

// 技能导师配置
export interface SkillTrainerNpcConfig extends NpcBaseConfig {
    skills: Skill[];        // 可学习的技能列表
    levelRequirement?: number; // 学习等级要求
}

// NPC配置表
export const NPC_CONFIGS = {
    // 商人NPC
    SHOP_KEEPER: {
        id: 'shop_1',
        name: '杂货商人',
        description: '售卖各种商品的商人',
        functions: [NpcFunction.SHOP],
        dialogs: {
            default: {
                id: 'default',
                text: '欢迎光临！需要些什么吗？',
                options: [{ text: '再见' }]
            }
        },
        defaultDialogId: 'default',
        goods: [
            // 商品列表
        ],
        buyRates: {
            // 特殊商品的购买价格倍率
        },
        sellRates: {
            // 特殊商品的出售价格倍率
        }
    } as ShopNpcConfig,

    // 强化NPC
    BLACKSMITH: {
        id: 'blacksmith_1',
        name: '铁匠',
        description: '可以强化装备的铁匠',
        functions: [NpcFunction.ENHANCE],
        dialogs: {
            default: {
                id: 'default',
                text: '想要强化装备吗？',
                options: [{ text: '再见' }]
            }
        },
        defaultDialogId: 'default',
        enhanceCostMultiplier: 1.0
    } as EnhanceNpcConfig,

    // 技能导师
    SKILL_MASTER: {
        id: 'skill_master_1',
        name: '技能导师',
        description: '教授各种技能的导师',
        functions: [NpcFunction.SKILL],
        dialogs: {
            default: {
                id: 'default',
                text: '想要学习新技能吗？',
                options: [{ text: '再见' }]
            }
        },
        defaultDialogId: 'default',
        skills: [
            // 技能列表
        ]
    } as SkillTrainerNpcConfig,
} as const; 