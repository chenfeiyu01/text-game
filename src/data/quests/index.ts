import { QuestConfig, QuestType, QuestObjectiveType } from '../../constants/quest';
import { Monsters } from '../../constants/monsters';
import { ItemId } from '../../constants/item';
import { ESCENES } from '../../constants/scenes';
import MONSTERS from '../character/monsters';
import { NpcFunction } from '../../constants/npc';

export const QUESTS: QuestConfig[] = [
    // 新手引导任务链
    {
        id: 'WELCOME_TO_ADVENTURE',
        title: '冒险的开始',
        type: QuestType.MAIN,
        description: '与技能导师对话，了解基本的战斗技巧。',
        level: 1,
        objectives: [
            {
                type: QuestObjectiveType.LEARN_SKILL,
                target: 'SLASH',
                current: 0,
                required: 1,
                description: '学习技能：斩击'
            }
        ],
        reward: {
            exp: 50,
            gold: 100
        },
        dialogs: {
            start: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '欢迎来到冒险者公会！在开始冒险之前，让我教你一些基本的战斗技巧。',
                    options: [{ text: '请指导我', next: null }]
                }
            ],
            progress: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '学习技能是变强的关键。'
                }
            ],
            complete: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '很好！现在你已经掌握了基本技能。'
                }
            ]
        },
        story: {
            title: '踏上冒险之路',
            content: '你来到了冒险者公会，开始了解这个世界的基本规则。技能导师向你介绍了战斗技巧，这是每个冒险者的必修课。'
        }
    },
    {
        id: 'FIRST_BATTLE',
        title: '初次战斗',
        type: QuestType.MAIN,
        description: '前往枫叶林，与被污染的兔子战斗，测试你的战斗技巧。',
        level: 1,
        objectives: [
            {
                type: QuestObjectiveType.KILL_MONSTER,
                target: Monsters.CORRUPTED_RABBIT,
                current: 0,
                required: 3,
                description: `击败3只${MONSTERS[Monsters.CORRUPTED_RABBIT].name}`
            }
        ],
        reward: {
            exp: 100,
            gold: 100,
            items: [
                { id: ItemId.Consumable.HEALTH_POTION_1, quantity: 3 }
            ]
        },
        dialogs: {
            start: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '是时候实践一下了。前往枫叶林，那里有一些被污染的兔子，它们实力较弱，适合你进行实战训练。',
                    options: [{ text: '明白了', next: null }]
                }
            ],
            progress: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '继续努力，完成训练！'
                }
            ],
            complete: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '做得不错！这些生命药水送给你，记住在战斗中及时恢复生命值。'
                }
            ]
        },
        story: {
            title: '初次实战',
            content: '枫叶林是新手冒险者的试炼场。这里的被污染兔子虽然实力不强，但它们的存在暗示着这个世界正在发生某种异变。'
        },
        prerequisiteQuests: ['WELCOME_TO_ADVENTURE']
    },
    {
        id: 'GEAR_UP',
        title: '装备强化',
        type: QuestType.MAIN,
        description: '拜访铁匠，了解装备强化系统。',
        level: 2,
        objectives: [
            {
                type: QuestObjectiveType.ENHANCE_ITEM,
                target: ItemId.Gear.WOODEN_SWORD,
                current: 0,
                required: 1,
                description: '强化任意装备1次'
            }
        ],
        reward: {
            exp: 150,
            gold: 200
        },
        dialogs: {
            start: [
                {
                    npcId: NpcFunction.ENHANCE,
                    text: '想要在更危险的地方冒险，光有技巧是不够的。让我教你如何强化装备。',
                    options: [{ text: '请教我', next: null }]
                }
            ],
            progress: [
                {
                    npcId: NpcFunction.ENHANCE,
                    text: '强化装备需要消耗金币和材料，材料可以通过击败怪物获得。'
                }
            ],
            complete: [
                {
                    npcId: NpcFunction.ENHANCE,
                    text: '很好！记住，装备��品质对冒险至关重要。'
                }
            ]
        },
        story: {
            title: '装备的重要性',
            content: '铁匠教会了你强化装备的方法。在这个危险的世界，一件称手的装备可能就是生存与死亡的区别。'
        },
        prerequisiteQuests: ['FIRST_BATTLE']
    },
    {
        id: 'MAPLE_FOREST_CHALLENGE',
        title: '枫叶林的挑战',
        type: QuestType.MAIN,
        description: '击败盘踞在枫叶林的蘑菇战士，证明你的实力。',
        level: 3,
        objectives: [
            {
                type: QuestObjectiveType.COMPLETE_DUNGEON,
                target: ESCENES.MAPLE_FOREST,
                current: 0,
                required: 1,
                description: '通关枫叶林'
            }
        ],
        reward: {
            exp: 300,
            gold: 500,
            items: [
                { id: ItemId.Gear.IRON_SWORD, quantity: 1 }
            ]
        },
        dialogs: {
            start: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '你已经掌握了基本的战斗技巧，现在是时候面对真正的挑战了。枫叶林深处有一个强大的蘑菇战士，击败它将证明你已经准备好面对更大的挑战。',
                    options: [{ text: '我准备好了', next: null }]
                }
            ],
            progress: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '如果无法���败蘑菇战士，可以先提升装备和技能等级。'
                }
            ],
            complete: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '太棒了！你已经证明了自己的实力。这把铁剑送给你，它将帮助你面对接下来的挑战。'
                }
            ]
        },
        story: {
            title: '森林深处的威胁',
            content: '蘑菇战士是枫叶林的统治者，它比普通的被污染生物更加危险。有传言说，这些生物的异变与一股神秘的黑暗力量有关。'
        },
        prerequisiteQuests: ['GEAR_UP']
    }
];