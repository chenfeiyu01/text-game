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
        sceneId: string;
        monsterId: Monsters;
        playerLevel: number;
        luck?: number;  // 玩家幸运值加成
    }): ItemId[] {
        const { sceneId, monsterId, playerLevel, luck = 1 } = params;
        const drops: ItemId[] = [];
        const monsterDrops = MONSTER_DROPS[monsterId];
        const sceneModifier = SCENE_DROP_MODIFIERS[sceneId];
        
        if (!monsterDrops) return drops;

        debugger
        monsterDrops.forEach(rule => {
            if (!this.checkDropCondition(rule, playerLevel)) return;

            const finalChance = this.calculateFinalChance(rule, sceneModifier, luck);
            if (Math.random() < finalChance) {
                const quantity = this.calculateDropQuantity(rule, sceneModifier);
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
        luck: number
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