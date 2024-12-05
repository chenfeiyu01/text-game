import { QuestConfig, QuestType, QuestObjectiveType } from '../../constants/quest';
import { Monsters } from '../../constants/monsters';
import { ItemId } from '../../constants/item';
import { ESCENES, SCENE_NAMES } from '../../constants/scenes';
import MONSTERS from '../character/monsters';
import { NpcFunction } from '../../constants/npc';

export const QUESTS: QuestConfig[] = [
    // 新手引导任务链
    {
        id: 'WELCOME_TO_ADVENTURE',
        title: '新手的第一步',
        type: QuestType.MAIN,
        description: '经过半天的跋涉，你来到了镇上的冒险者协会，协会里总是挤满了来自各地的冒险者。看看有什么简单的任务适合你。',
        level: 1,
        objectives: [
            {
                type: QuestObjectiveType.KILL_MONSTER,
                target: Monsters.CORRUPTED_RABBIT,
                current: 0,
                required: 3,
                description: `前往${SCENE_NAMES[ESCENES.MAPLE_FOREST]}，消灭3只被${MONSTERS[Monsters.CORRUPTED_RABBIT].name}`
            }
        ],
        reward: {
            exp: 50,
            gold: 100,
            items: [
                { id: ItemId.Gear.WOODEN_SWORD, quantity: 1 }
            ]
        },
        matchScenes: [ESCENES.MAPLE_FOREST],
        dialogs: {
            start: [
                {
                    npcId: NpcFunction.SKILL,
                    text: `在协会大厅的任务公告板前，一位面带和善笑容的女性接待员莉娜注意到了你。
"你是新来的冒险者吧？"莉娜翻看着手中的任务卷轴，"最近连兔子都变得不太正常了。镇子南边的${SCENE_NAMES[ESCENES.MAPLE_FOREST]}里出现了一些异变的兔子，它们的眼睛会发出奇怪的红光，还会主动攻击农民。"
她取下一张委托书递给你："这个任务很适合初出茅庐的冒险者。需要你去消灭三只${MONSTERS[Monsters.CORRUPTED_RABBIT].name}。别被它们可爱的外表骗了，这些家伙现在可不是普通的食草动物。"`,
                    options: [{ text: '交给我吧', next: null }]
                }
            ],
            progress: [
                {
                    npcId: NpcFunction.SKILL,
                    text: '继续努力，完成任务！'
                }
            ],
            complete: [
                {
                    npcId: NpcFunction.SKILL,
                    text: `"作为菜鸟来说，你的表现还不错嘛。"莉娜接过你递来的证明，仔细检查后点点头。
"做得很好，这是你的第一份报酬。"她递给你一个小布袋。
她看了看公告板："要不要继续？协会里还有不少适合新手的委托。"`,
                }
            ]
        },
        story: {
            title: '踏上冒险之路',
            content: `当你回到冒险者协会时，莉娜正在整理桌上的文件。看到你身上沾着些许尘土和草屑，她露出了理解的微笑。
"看来你完成任务了？"莉娜放下手中的文件，"这些异变兔子确实比普通的兔子难对付得多。来，让我看看..."
你向她描述了战斗的经过，她认真地记录在案。
"干得不错！"莉娜在任务卷轴上盖上了完成的印章，"第一次执行任务就这么顺利，看来你很有冒险者的天赋。"
她从抽屉里取出一个小袋子："这是你的报酬，50枚铜币。对了，还有这个..."
莉娜又拿出一枚铜质徽章："这是'见习冒险者'的徽章。虽然只是最基础的等级，但这代表着你正式成为了一名冒险者。继续努力的话，以后还能获得更高级的徽章。"
她若有所思地补充道："说起来，最近像这样的异变生物越来越多了。不知道是不是和那些奇怪的传闻有关...算了，这些都是协会高层要操心的事。"
莉娜整理好文件，微笑着说："要不要再接一个任务？协会里还有不少适合新手的委托。"`
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