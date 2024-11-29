/**
 * 导入所需的类型和类
 */
import { BattleLog, BattleResult } from "../constants/battle";
import { MessageType } from "../constants/game-system";
import { GameSystem } from "./game-system";
import { Character } from "./human";

/**
 * 战斗系统类
 * 负责处理战斗流程、回合制、伤害计算等
 */
export class BattleSystem {
    private gameSystem: GameSystem;
    private currentRound: number = 0;  // 当前回合数
    private battleLogs: BattleLog[] = [];  // 战斗日志记录
    private isPlayerTurn: boolean = true;  // 是否为玩家回合

    /**
     * 构造函数
     * @param player 玩家角色
     * @param enemy 敌方角色
     * @param onBattleUpdate 战斗更新回调函数
     */
    constructor(
        private player: Character,
        private enemy: Character,
        private onBattleUpdate?: (log: BattleLog) => void
    ) {
        this.gameSystem = GameSystem.getInstance();
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

        let damage = 0;
        let action = '';
        let isCrit = false;
        if (canUseSkill && this.player.equippedSkill) {
            // 使用技能
            this.player.useSkill();
            const damageResult = this.player.calculateDamage(this.player.equippedSkill.damage);
            const result = this.enemy.takeDamage(damageResult.damage);
            damage = result.damage;
            isCrit = damageResult.isCrit;

            action = `使用技能「${this.player.equippedSkill.name}」`;
            this.recordBattleAction(action, damage, this.player, this.enemy, isCrit);
        } else {
            // 普通攻击
            const damageResult = this.player.attackTarget(this.enemy);
            damage = damageResult.damage;
            isCrit = damageResult.isCrit;

            action = isCrit ? "造成暴击" : "普通攻击";
            this.recordBattleAction(action, damage, this.player, this.enemy, isCrit);
        }
    }

    /**
     * 执行敌方回合
     * 处理敌方的攻击行为
     */
    private async performEnemyTurn() {
        const damageResult = this.enemy.attackTarget(this.player);
        const damage = damageResult.damage;
        const isCrit = damageResult.isCrit;
        this.recordBattleAction("普通攻击", damage, this.enemy, this.player, isCrit);
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
            `[回合${this.currentRound}] ${attacker.name} ${action}，${critText}对 ${defender.name} 造成 ${damage} 点伤害！`
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
     * 处理战斗结算，包括经验值奖励等
     * @param result 战斗结果
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

        if (winner === this.player) {
            // 获得经验值
            const expGained = this.enemy.level * 10;
            this.player.gainExp(expGained);

            this.gameSystem.sendMessage(
                MessageType.REWARD,
                `获得 ${expGained} 点经验值！`
            );
        }
    }

    /**
     * 获取战斗总结
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
}





