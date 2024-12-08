import { Player } from './player';
import { GearItem, GearSlot, Item } from '../constants/item';
import { StatType } from '../constants/stats';
import { getSkillById } from '../utils/skills';

/** 保存的游戏数据接口 */
interface SaveData {
    /** 玩家名称 */
    name: string;
    /** 基础属性 */
    baseStats: Record<StatType, number>;
    /** 当前生命值 */
    hp: number;
    /** 当前魔法值 */
    mp: number;
    /** 当前经验值 */
    exp: number;
    /** 当前等级 */
    level: number;
    /** 当前充能值 */
    charge: number;
    /** 金币数量 */
    gold: number;
    /** 已装备的物品 */
    equippedItems: { [key in GearSlot]?: GearItem };
    /** 背包物品 */
    inventory: { [key: string]: { item: Item; count: number } };
    /** 已学习的技能ID列表 */
    learnedSkills: string[];
    /** 当前装备的技能ID */
    equippedSkill?: string;
}

/** 游戏存档系统 */
export class SaveSystem {
    private static readonly SAVE_KEY = 'game_save';

    /** 保存游戏 */
    static save(): void {
        const player = Player.getInstance();
        
        const saveData: SaveData = {
            name: player.name,
            baseStats: player.getAllBaseStats(),
            hp: player.hp,
            mp: player.mp,
            exp: player.exp,
            level: player.level,
            charge: player.charge,
            gold: player.inventory.gold,
            equippedItems: player.equippedItems,
            inventory: player.inventory.getSerializableItems(),
            learnedSkills: Array.from(player.skills),
            equippedSkill: player.equippedSkill?.id
        };

        localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
        console.log('游戏已保存');
    }

    /** 加载游戏 */
    static load(): boolean {
        const saveStr = localStorage.getItem(this.SAVE_KEY);
        if (!saveStr) {
            console.log('没���找到存档');
            return false;
        }

        try {
            const saveData: SaveData = JSON.parse(saveStr);

            // 初始化玩家
            const player = Player.initializePlayer({
                name: saveData.name,
                maxHp: saveData.baseStats[StatType.MAX_HP],
                maxMp: saveData.baseStats[StatType.MAX_MP],
                attack: saveData.baseStats[StatType.ATTACK],
                defense: saveData.baseStats[StatType.DEFENSE],
                critRate: saveData.baseStats[StatType.CRIT_RATE],
                critDamage: saveData.baseStats[StatType.CRIT_DAMAGE],
                chargeRate: saveData.baseStats[StatType.CHARGE_RATE]
            });

            // 恢复基础属性
            player.setAllBaseStats(saveData.baseStats);

            // 恢复状态
            player.restoreState({
                hp: saveData.hp,
                mp: saveData.mp,
                exp: saveData.exp,
                level: saveData.level,
                charge: saveData.charge
            });

            // 恢复装备
            Object.entries(saveData.equippedItems).forEach(([slot, item]) => {
                player.restoreEquipment(slot as GearSlot, item);
            });

            // 恢复背包
            player.inventory.restoreGold(saveData.gold);
            Object.entries(saveData.inventory).forEach(([id, data]) => {
                player.inventory.addItem(data.item, data.count);
            });

            // 恢复技能
            player.restoreSkills(new Set(saveData.learnedSkills));
            if (saveData.equippedSkill) {
                const skill = getSkillById(saveData.equippedSkill);
                if (skill) {
                    player.equipSkill(skill);
                }
            }

            // 更新最终属性
            player.refreshState();

            console.log('游戏已加载');
            return true;
        } catch (error) {
            console.error('加载存档失败:', error);
            return false;
        }
    }

    /** 检查是否有存档 */
    static hasSave(): boolean {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }

    /** 删除存档 */
    static deleteSave(): void {
        localStorage.removeItem(this.SAVE_KEY);
        console.log('存档已删除');
    }
} 