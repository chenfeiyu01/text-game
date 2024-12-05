import { Character } from './character';
import { GameSystem } from './game-system';
import { GameMessage, MessageType } from '../constants/game-system';
import { getSkillById } from '../utils/skills';
import { Player } from './player';
import { isGearItem, Item, ItemId } from '../constants/item';
import { QuestSystem } from './quest-system';
import { QuestStatus } from '../constants/quest';


interface GameSaveData {
    version: string;
    timestamp: number;
    player: ReturnType<Player['serialize']>;
    messages: GameMessage[];
    quests: {
        progress: [string, {
            status: QuestStatus;
            objectives: { current: number; required: number; }[];
        }][];
    };
}

export class SaveSystem {
    private static instance: SaveSystem;
    private readonly SAVE_KEY = 'game_save_data';
    private readonly CURRENT_VERSION = '1.0.0';

    private constructor() { }

    public static getInstance(): SaveSystem {
        if (!SaveSystem.instance) {
            SaveSystem.instance = new SaveSystem();
        }
        return SaveSystem.instance;
    }

    /**
     * 保存游戏数据
     */
    public saveGame(player: Player): void {
        const gameSystem = GameSystem.getInstance();
        const questSystem = QuestSystem.getInstance();

        const saveData: GameSaveData = {
            version: this.CURRENT_VERSION,
            timestamp: Date.now(),
            player: player.serialize(),
            messages: gameSystem.getRecentMessages(100), // 保存最近100条消息
            quests: {
                progress: Array.from(questSystem['questProgress'].entries())
            }
        };

        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            gameSystem.sendMessage(MessageType.SYSTEM, '游戏已保存');
        } catch (error) {
            gameSystem.sendMessage(MessageType.ERROR, '保存游戏失败');
            console.error('保存游戏失败:', error);
        }
    }

    /**
     * 加载游戏数据
     * @returns 加载的角色数据或undefined（加载失败时）
     */
    public loadGame(): boolean {
        try {
            const saveDataString = localStorage.getItem(this.SAVE_KEY);
            if (!saveDataString) {
                GameSystem.getInstance().sendMessage(MessageType.SYSTEM, '没有找到存档数据');
                return false;
            }

            const saveData: GameSaveData = JSON.parse(saveDataString);

            // 初始化玩家实例
            Player.initializePlayer({
                name: saveData.player.name,
                maxHp: saveData.player.maxHp,
                maxMp: saveData.player.maxMp,
                attack: saveData.player.attack,
                defense: saveData.player.defense,
                critRate: saveData.player.critRate,
                critDamage: saveData.player.critDamage,
                chargeRate: saveData.player.chargeRate
            });

            // 恢复玩家状态
            this.restorePlayerState(Player.getInstance(), saveData.player);

            // 恢复消息历史
            GameSystem.getInstance().restoreMessages(saveData.messages);

            if (saveData.quests) {
                const questSystem = QuestSystem.getInstance();
                saveData.quests.progress.forEach(([questId, progress]) => {
                    questSystem['questProgress'].set(questId, progress);
                });
            }

            GameSystem.getInstance().sendMessage(MessageType.SYSTEM, '游戏数据已加载');
            return true;
        } catch (error) {
            GameSystem.getInstance().sendMessage(MessageType.ERROR, '加载游戏失败');
            console.error('加载游戏失败:', error);
            return false;
        }
    }

    /**
     * 恢复角色状态
     */
    private restorePlayerState(player: Player, savedState: ReturnType<Player['serialize']>): void {
        // 恢复基础状态
        player.restoreState({
            level: savedState.level,
            exp: savedState.exp,
            hp: savedState.hp,
            mp: savedState.mp,
            attack: savedState.attack,
            defense: savedState.defense,
            critRate: savedState.critRate,
            critDamage: savedState.critDamage,
            chargeRate: savedState.chargeRate
        });

        // 恢复技能
        savedState.skills.forEach(skillId => {
            const skill = getSkillById(skillId);
            if (skill) player.learnSkill(skill);
        });

        if (savedState.equippedSkillId) {
            const skill = getSkillById(savedState.equippedSkillId);
            if (skill) player.equipSkill(skill);
        }

        // 恢复背包
        if (savedState.inventory) {
            Object.entries(savedState.inventory.items).forEach(([id, data]) => {
                player.inventory.addItem(data.item, data.quantity);
            });
            player.inventory.addGold(savedState.inventory.gold);
        }

        // 恢复装备
        savedState.equippedItems.forEach(({ slot, itemId }) => {
            if (itemId) {
                const item = player.inventory.getItems().find(i => i.item.id === itemId)?.item;
                if (item && isGearItem(item)) {
                    player.equipItem(item);
                }
            }
        });
    }

    /**
     * 检查是否存在存档
     */
    public hasSaveData(): boolean {
        return !!localStorage.getItem(this.SAVE_KEY);
    }

    /**
     * 删除存档
     */
    public deleteSaveData(): void {
        localStorage.removeItem(this.SAVE_KEY);
        GameSystem.getInstance().sendMessage(MessageType.SYSTEM, '存档已删除');
    }
} 