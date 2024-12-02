import { Character } from './character';
import { GameSystem } from './game-system';
import { GameMessage, MessageType } from '../constants/game-system';
import { getSkillById } from '../utils/skills';
import { Player } from './player';


interface GameSaveData {
    version: string;
    timestamp: number;
    player: {
        name: string;
        level: number;
        exp: number;
        maxHp: number;
        maxMp: number;
        hp: number;
        mp: number;
        attack: number;
        defense: number;
        critRate: number;
        critDamage: number;
        chargeRate: number;
        equippedSkillId?: string;
    };
    messages: GameMessage[];
    // 可以根据需要添加其他需要保存的游戏数据
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
    public saveGame(player: Character): void {
        const gameSystem = GameSystem.getInstance();

        const saveData: GameSaveData = {
            version: this.CURRENT_VERSION,
            timestamp: Date.now(),
            player: {
                name: player.name,
                level: player.level,
                exp: player.exp,
                maxHp: player.maxHp,
                maxMp: player.maxMp,
                hp: player.hp,
                mp: player.mp,
                attack: player.attack,
                defense: player.defense,
                critRate: player.critRate,
                critDamage: player.critDamage,
                chargeRate: player.chargeRate,
                equippedSkillId: player.equippedSkill?.id
            },
            messages: gameSystem.getRecentMessages(100) // 保存最近100条消息
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

            // 版本检查
            if (saveData.version !== this.CURRENT_VERSION) {
                GameSystem.getInstance().sendMessage(
                    MessageType.ERROR,
                    '存档版本不匹配，可能会出现兼容性问题'
                );
            }

            this.restorePlayerState(Player.getInstance(), saveData.player);

            // 恢复游戏消息
            const gameSystem = GameSystem.getInstance();
            gameSystem.sendMessage(MessageType.SYSTEM, '游戏数据已加载');
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
    private restorePlayerState(player: Character, savedState: GameSaveData['player']): void {
        // 这里需要在Character类中添加相应的方法来设置这些属性
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

        // 如果有已装备的技能，重新装备
        if (savedState.equippedSkillId) {
            // 这里需要一个根据ID获取技能的方法
            const skill = getSkillById(savedState.equippedSkillId);
            if (skill) {
                player.equipSkill(skill);
            }
        }

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