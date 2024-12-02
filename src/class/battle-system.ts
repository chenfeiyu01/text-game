/**
 * 导入所需的类型和类
 */
import { BattleLog, BattleResult, BattleReward } from "../constants/battle";
import { MessageType } from "../constants/game-system";
import { GameSystem } from "./game-system";
import { Character } from "./character";
import { Player } from "./player";
import { getItemById } from "../utils/items";
import { isGearItem } from "../constants/item";

/**
 * 战斗系统类
 * 负责处理战斗流程、回合制、伤害计算等
 */
export class BattleSystem {
    private gameSystem: GameSystem;
    private currentRound: number = 0;  // 当前回合数
    private battleLogs: BattleLog[] = [];  // 战斗日志记录
    private isPlayerTurn: boolean = true;  // 是否为玩家回合
    private battleReward?: BattleReward;  // 新增：战斗奖励

    /**
     * 构造函数
     * @param player 玩家角色
     * @param enemy 敌方角色
     * @param onBattleUpdate 战斗更新回调函数
     * @param reward 战斗奖励配置
     */
    constructor(
        private player: Character,
        private enemy: Character,
        private onBattleUpdate?: (log: BattleLog) => void,
        private reward?: BattleReward  // 新增：接收奖励配置
    ) {
        this.gameSystem = GameSystem.getInstance();
        this.battleReward = reward;
    }

    private static instance: BattleSystem;

    /**
     * 获取战斗系统单例
     * @returns BattleSystem实例
     */
    public static getInstance(): BattleSystem {
        return BattleSystem.instance;
    }

    /**
     * 开始战斗
     * @returns 战斗结果
     */
    public async startBattle(): Promise<BattleResult> {
        this.gameSystem.sendMessage(
            MessageType.COMBAT,
            `战斗开始：${this.player.name} VS ${this.enemy.name}`
        );

        while (true) {
            this.currentRound++;

            // 角色行动
            if (this.isPlayerTurn) {
                await this.performPlayerTurn();
            } else {
                await this.performEnemyTurn();
            }

            // 检查战斗结果
            const result = this.checkBattleResult();
            console.log(`战斗结果：${result}`);
            if (result !== BattleResult.ONGOING) {
                this.endBattle(result === BattleResult.VICTORY ? this.player : this.enemy);
                return result;
            }

            // 切换回合
            this.isPlayerTurn = !this.isPlayerTurn;

            // 模拟战斗节奏
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    /**
     * 执行玩家回合
     * 处理玩家的技能使用和普通攻击
     */
    private async performPlayerTurn() {
        // 检查是否可以使用技能
        const canUseSkill = this.player.charge >= 100 &&
            this.player.mp >= (this.player.equippedSkill?.manaCost || 0);

        if (canUseSkill && this.player.equippedSkill) {
            // 使用技能
            this.player.useSkill();
            const damageResult = this.player.calculateDamage(this.player.equippedSkill.damage);
            const result = this.enemy.takeDamage(damageResult.damage);
            this.recordBattleAction(
                `使用技能「${this.player.equippedSkill.name}」`, 
                result.damage, 
                this.player, 
                this.enemy, 
                damageResult.isCrit
            );
        } else {
            // 普通攻击
            this.handleAttack(this.player, this.enemy);
        }
    }

    /**
     * 执行敌方回合
     * 处理敌方的攻击行为
     */
    private async performEnemyTurn() {
        this.handleAttack(this.enemy, this.player);
    }

    /**
     * 记录战斗行动
     * @param action 行动描述
     * @param damage 造成的伤害
     * @param attacker 攻击者
     * @param defender 防御者
     * @param isCrit 是否暴击
     */
    private recordBattleAction(
        action: string,
        damage: number,
        attacker: Character,
        defender: Character,
        isCrit: boolean = false
    ) {
        const log: BattleLog = {
            round: this.currentRound,
            action,
            damage,
            attacker: attacker.name,
            defender: defender.name,
            attackerHp: attacker.hp,
            defenderHp: defender.hp,
            isCrit,
            isDefeated: defender.hp <= 0
        };

        this.battleLogs.push(log);

        // 发送战斗消息
        const critText = isCrit ? "【暴击】" : "";
        this.gameSystem.sendMessage(
            MessageType.COMBAT,
            `[回合${this.currentRound}] ${attacker.name} ${action}，${critText}对 ${defender.name} 造成 ${damage} 点伤害！`,
            log
        );

        if (this.onBattleUpdate) {
            this.onBattleUpdate(log);
        }
    }

    /**
     * 检查战斗结果
     * @returns 战斗结果状态
     */
    private checkBattleResult(): BattleResult {
        if (this.enemy.hp <= 0) return BattleResult.VICTORY;
        if (this.player.hp <= 0) return BattleResult.DEFEAT;
        return BattleResult.ONGOING;
    }

    /**
     * 结束战斗
     * @param winner 获胜者
     */
    private endBattle(winner: Character) {
        console.log('走到了endBattle', winner)
        // 记录战斗结束消息到战斗日志
        this.battleLogs.push({
            round: this.currentRound,
            attacker: winner.name,
            defender: winner === this.player ? this.enemy.name : this.player.name,
            action: "获得胜利",
            damage: 0,
            isCrit: false,
            isDefeated: true,
            attackerHp: winner.hp,
            defenderHp: (winner === this.player ? this.enemy.hp : this.player.hp)
        });

        // 同时发送到游戏系统的消息系统
        this.gameSystem.sendMessage(
            MessageType.COMBAT,
            `战斗结束！${winner.name} 获胜！`
        );

        if (winner === this.player && this.battleReward) {
            const player = Player.getInstance();
            
            // 获得金币
            if (this.battleReward.gold) {
                player.inventory.addGold(this.battleReward.gold);
                this.gameSystem.sendMessage(
                    MessageType.REWARD,
                    `获得 ${this.battleReward.gold} 金币！`
                );
            }

            // 获得经验值
            this.player.gainExp(this.battleReward.exp);
            this.gameSystem.sendMessage(
                MessageType.REWARD,
                `获得 ${this.battleReward.exp} 点经验值！`
            );

            // 获得物品
            if (this.battleReward.items?.length) {
                this.battleReward.items.forEach(itemId => {
                    const item = getItemById(itemId);
                    if (item) {
                        player.inventory.addItem(item);
                        this.gameSystem.sendMessage(
                            MessageType.REWARD,
                            `获得物品：${item.name}！`
                        );
                    }
                });
            }
        }
    }

    /**
     * 获取战斗结
     * @returns 包含所有战斗日志的字符串
     */
    public getBattleSummary(): string {
        return this.battleLogs
            .map(log => {
                return `[回合${log.round}] ${log.attacker} ${log.action}，` +
                    `造成 ${log.damage} 点伤害\n` +
                    `${log.attacker}: ${log.attackerHp}HP, ` +
                    `${log.defender}: ${log.defenderHp}HP`;
            })
            .join('\n\n');
    }

    private handleAttack(attacker: Character, defender: Character): void {
        const isCritical = Math.random() < attacker.critRate;
        let damage = attacker.attack * (1 + (isCritical ? attacker.critDamage : 0));
        damage = Math.max(1, damage - defender.defense);

        defender.takeDamage(damage);

        // 发送战斗消息
        this.gameSystem.sendMessage(
            MessageType.COMBAT,
            `${attacker.name} 对 ${defender.name} 造成了 ${damage.toFixed(0)} 点${isCritical ? '暴击' : ''}伤害`
        );

        // 如果是暴击且攻击者是玩家，触发装备效果
        if (isCritical && attacker instanceof Player) {
            const equippedItems = attacker.inventory.getItems()
                .filter(item => isGearItem(item.item) && item.item.slot === 'weapon');
            
            equippedItems.forEach(({ item }) => {
                if (isGearItem(item) && item.effects) {
                    item.effects.forEach(effect => {
                        if (effect.type === 'onHit' && effect.condition === 'isCritical') {
                            effect?.effect?.(attacker);
                        }
                    });
                }
            });
        }

        // 更新效果持续时间
        attacker.updateEffects();
        defender.updateEffects();
    }
}





