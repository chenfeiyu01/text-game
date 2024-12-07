import { EventConfig, EventResultType } from '../../constants/scenes';
import { StatType } from '../../constants/stats';
import { ItemId } from '../../constants/item';

export const BATTLE_EVENTS = {
    ANCIENT_ALTAR: {
        id: 'ANCIENT_ALTAR',
        title: '古老的祭坛',
        description: '你发现了一座布满苔藓的古老祭坛，上面刻着神秘的符文。',
        options: [
            {
                text: '献上一些金币 (消耗100金币)',
                results: [
                    {
                        weight: 40,
                        result: {
                            type: EventResultType.BUFF,
                            value: 0.2,
                            duration: 3,
                            stat: StatType.ATTACK,
                            description: '获得攻击力提升20%，持续3场战斗'
                        }
                    },
                    {
                        weight: 30,
                        result: {
                            type: EventResultType.BUFF,
                            value: 0.15,
                            duration: 2,
                            stat: StatType.CRIT_RATE,
                            description: '获得暴击率提升15%，持续2场战斗'
                        }
                    },
                    {
                        weight: 20,
                        result: {
                            type: EventResultType.ITEM,
                            value: 1,
                            itemId: ItemId.Consumable.HEALTH_POTION_1,
                            description: '获得初级生命药水'
                        }
                    },
                    {
                        weight: 10,
                        result: {
                            type: EventResultType.GOLD,
                            value: -100,
                            description: '金币消失了，什么都没发生...'
                        }
                    }
                ]
            },
            {
                text: '尝试解读符文',
                results: [
                    {
                        weight: 50,
                        result: {
                            type: EventResultType.BUFF,
                            value: 0.1,
                            duration: 2,
                            stat: StatType.SPELL_AFFINITY,
                            description: '获得法术亲和提升10%，持续2场战斗'
                        }
                    },
                    {
                        weight: 30,
                        result: {
                            type: EventResultType.DAMAGE,
                            value: 0.2,
                            description: '符文爆炸，损失20%生命值'
                        }
                    },
                    {
                        weight: 20,
                        result: {
                            type: EventResultType.HIDDEN_BOSS,
                            value: 0,
                            description: '你惊醒了沉睡的远古守卫！'
                        }
                    }
                ]
            }
        ]
    },

    MYSTERIOUS_MERCHANT: {
        id: 'MYSTERIOUS_MERCHANT',
        title: '神秘商人',
        description: '一个披着斗篷的商人从阴影中走出，他的货物看起来很特别...',
        options: [
            {
                text: '查看商品 (消耗200金币)',
                results: [
                    {
                        weight: 50,
                        result: {
                            type: EventResultType.ITEM,
                            value: 1,
                            itemId: ItemId.Consumable.WARRIORS_POTION,
                            description: '获得战士药水'
                        }
                    }
                ]
            },
            {
                text: '询问情报',
                results: [
                    {
                        weight: 50,
                        result: {
                            type: EventResultType.BUFF,
                            value: 0.1,
                            duration: 2,
                            stat: StatType.CRIT_RATE,
                            description: '获得关于敌人弱点的情报，暴击率提升10%，持续2场战斗'
                        }
                    }
                ]
            }
        ]
    },

    HEALING_SPRING: {
        id: 'HEALING_SPRING',
        title: '治愈之泉',
        description: '你发现了一处散发着微光的清泉，泉水散发着治愈的能量。',
        options: [
            {
                text: '饮用泉水',
                results: [
                    {
                        weight: 50,
                        result: {
                            type: EventResultType.HEAL,
                            value: 0.5, // 恢复50%生命值
                            description: '恢复50%生命值'
                        }
                    }
                ]
            },
            {
                text: '收集泉水',
                results: [
                    {
                        weight: 50,
                        result: {
                            type: EventResultType.ITEM,
                            value: 2,
                            itemId: ItemId.Consumable.HEALTH_POTION_1,
                            description: '获得2瓶生命药水'
                        }
                    }
                ]
            }
        ]
    },

    CURSED_CHEST: {
        id: 'CURSED_CHEST',
        title: '诅咒宝箱',
        description: '一个被锁链缠绕的宝箱，上面萦绕着不祥的气息...',
        options: [
            {
                text: '强行打开',
                results: [
                    {
                        weight: 40,
                        result: {
                            type: EventResultType.GOLD,
                            value: 500,
                            description: '获得500金币！'
                        }
                    },
                    {
                        weight: 30,
                        result: {
                            type: EventResultType.DAMAGE,
                            value: 0.3,
                            description: '受到诅咒伤害，损失30%生命值'
                        }
                    },
                    {
                        weight: 20,
                        result: {
                            type: EventResultType.DEBUFF,
                            value: -0.2,
                            duration: 2,
                            stat: StatType.DEFENSE,
                            description: '受到诅咒，防御力降低20%，持续2场战斗'
                        }
                    },
                    {
                        weight: 10,
                        result: {
                            type: EventResultType.TREASURE,
                            value: 1,
                            itemId: ItemId.Gear.DRAGON_SLAYER,
                            description: '发现了传说中的龙之剑！'
                        }
                    }
                ]
            },
            {
                text: '谨慎离开',
                results: [
                    {
                        weight: 50,
                        result: {
                            type: EventResultType.BUFF,
                            value: 0.15,
                            duration: 2,
                            stat: StatType.DEFENSE,
                            description: '因为谨慎的选择，获得15%防御力提升，持续2场战斗'
                        }
                    }
                ]
            }
        ]
    }
} as const satisfies Record<string, EventConfig>;

// 导出事件ID类型
export type BattleEventId = keyof typeof BATTLE_EVENTS;

// 获取所有事件的数组
export const getAllEvents = () => Object.values(BATTLE_EVENTS);
