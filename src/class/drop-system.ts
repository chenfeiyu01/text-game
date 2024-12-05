import { ItemId } from '../constants/item';
import { DropRule, DropItemType, SceneDropModifier } from '../constants/drop';
import { MONSTER_DROPS, SCENE_DROP_MODIFIERS } from '../data/drops';
import { Monsters } from '../constants/monsters';

export class DropSystem {
    private static instance: DropSystem;

    private constructor() {}

    public static getInstance(): DropSystem {
        if (!DropSystem.instance) {
            DropSystem.instance = new DropSystem();
        }
        return DropSystem.instance;
    }

    /**
     * 计算掉落物品
     */
    public calculateDrops(params: {
        sceneId: string;        // 场景ID
        monsterId: Monsters;    // 怪物ID
        playerLevel: number;    // 玩家等级
        luck?: number;          // 玩家幸运值加成
    }): ItemId[] {
        // 解构参数
        const { sceneId, monsterId, playerLevel, luck = 1 } = params;
        // 初始化掉落物品数组
        const drops: ItemId[] = [];
        // 获取怪物掉落规则
        const monsterDrops = MONSTER_DROPS[monsterId];
        // 获取场景掉落修正
        const sceneModifier = SCENE_DROP_MODIFIERS[sceneId];
        
        // 如果没有掉落规则,直接返回空数组
        if (!monsterDrops) return drops;

        // 遍历每个掉落规则
        monsterDrops.forEach(rule => {
            // 检查掉落条件是否满足
            if (!this.checkDropCondition(rule, playerLevel)) return;

            // 计算最终掉落概率
            const finalChance = this.calculateFinalChance(rule, sceneModifier, luck);
            console.log('finalChance', finalChance);
            // 生成随机数判定是否掉落
            const randomValue = Math.random();
            console.log('randomValue', randomValue);
            // 如果随机数小于掉落概率,则添加掉落物品
            if (randomValue < finalChance) {
                // 计算掉落数量
                const quantity = this.calculateDropQuantity(rule, sceneModifier);
                // 添加指定数量的物品到掉落列表
                for (let i = 0; i < quantity; i++) {
                    drops.push(rule.itemId);
                }
            }
        });

        return drops;
    }

    /**
     * 检查掉落条件
     */
    private checkDropCondition(rule: DropRule, playerLevel: number): boolean {
        if (!rule.condition) return true;

        const { minLevel, maxLevel, timeRange } = rule.condition;
        const currentHour = new Date().getHours();

        if (minLevel && playerLevel < minLevel) return false;
        if (maxLevel && playerLevel > maxLevel) return false;

        if (timeRange) {
            const { start, end } = timeRange;
            if (start <= end) {
                if (currentHour < start || currentHour > end) return false;
            } else {
                if (currentHour < start && currentHour > end) return false;
            }
        }

        return true;
    }

    /**
     * 计算最终掉落概率
     */
    private calculateFinalChance(
        rule: DropRule,
        sceneModifier: typeof SCENE_DROP_MODIFIERS[string] | undefined,
        luck: number = 1
    ): number {
        let chance = rule.baseChance * luck;
        
        if (sceneModifier) {
            chance *= sceneModifier.chanceMultiplier ?? 1;
            chance *= sceneModifier.itemModifiers?.[rule.itemId]?.chanceMultiplier ?? 1;
        }

        return Math.min(chance, 1);  // 确保概率不超过100%
    }

    /**
     * 计算掉落数量
     */
    private calculateDropQuantity(
        rule: DropRule,
        sceneModifier: typeof SCENE_DROP_MODIFIERS[string] | undefined
    ): number {
        let minQuantity = rule.minQuantity;
        let maxQuantity = rule.maxQuantity;
        
        if (sceneModifier) {
            const bonus = (sceneModifier.quantityBonus ?? 0) + 
                (sceneModifier.itemModifiers?.[rule.itemId]?.quantityBonus ?? 0);
            minQuantity += bonus;
            maxQuantity += bonus;
        }

        return Math.floor(Math.random() * (maxQuantity - minQuantity + 1)) + minQuantity;
    }
} 