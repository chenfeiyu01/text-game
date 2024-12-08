import { Scene, MonsterGroup, EventConfig } from '../constants/scenes';
import { Character } from './character';
import { RandomUtils } from '../utils/random';
import { DungeonNode } from '../constants/dungeon';


export class DungeonGenerator {
    private static instance: DungeonGenerator;

    public static getInstance(): DungeonGenerator {
        if (!DungeonGenerator.instance) {
            DungeonGenerator.instance = new DungeonGenerator();
        }
        return DungeonGenerator.instance;
    }

    /**
     * 生成副本结构
     */
    public generateDungeon(scene: Scene): DungeonNode {
        const { rules, monsterGroups, bosses, events } = scene;
        const { minBattles, maxBattles, minEvents, maxEvents } = rules;

        // 决定战斗和事件的数量（如果没有事件则事件数量为0）
        const battleCount = RandomUtils.getRandomInt(minBattles, maxBattles);
        const eventCount = events?.length 
            ? RandomUtils.getRandomInt(minEvents, maxEvents)
            : 0;

        // 生成节点池
        const nodes: DungeonNode[] = [
            // 生成战斗节点
            ...Array(battleCount).fill(null).map(() => ({
                type: 'BATTLE' as const,
                content: {
                    monster: this.generateMonster(monsterGroups)
                },
                next: []
            })),
            // 只在有事件时生成事件节点
            ...(events?.length ? Array(eventCount).fill(null).map(() => ({
                type: 'EVENT' as const,
                content: {
                    event: RandomUtils.getRandomElement(events)
                },
                next: []
            })) : [])
        ];

        // 打乱节点顺序
        this.shuffleArray(nodes);

        // 生成Boss节点
        const bossNode: DungeonNode = {
            type: 'BOSS',
            content: {
                monster: new Character(RandomUtils.getRandomElement(bosses))
            },
            next: []
        };

        // 构建节点关系
        for (let i = 0; i < nodes.length - 1; i++) {
            nodes[i].next.push(nodes[i + 1]);
        }
        // 最后一个节点连接到Boss
        if (nodes.length > 0) {
            nodes[nodes.length - 1].next.push(bossNode);
        }

        return nodes[0] || bossNode;
    }

    /**
     * 根据怪物组生成怪物
     */
    private generateMonster(groups: MonsterGroup[]): Character {
        const group = RandomUtils.getRandomElement(groups);
        const monster = RandomUtils.getRandomElement(group.monsters);
        const level = RandomUtils.getRandomInt(group.minLevel, group.maxLevel);

        const character = new Character(monster);
        // TODO: 根据level调整怪物属性
        return character;
    }

    /**
     * 打乱数组顺序
     */
    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
} 