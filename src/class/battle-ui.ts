import { BattleLog } from "../constants/battle";
import { Character } from "./human";

// 创建一个简单的UI组件来显示战斗信息
export class BattleUI {
    private container: HTMLElement;
    private logContainer: HTMLElement;
    private statusContainer: HTMLElement;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId)!;
        this.setupUI();
    }

    private setupUI() {
        // 检查是否已经存在这些元素
        if (this.container.querySelector('.battle-status') || this.container.querySelector('.battle-log')) {
            // 如果已存在，先清空容器
            this.container.innerHTML = '';
        }

        // 创建状态显示区域
        this.statusContainer = document.createElement('div');
        this.statusContainer.className = 'battle-status';
        this.container.appendChild(this.statusContainer);

        // 创建战斗日志区域
        // this.logContainer = document.createElement('div');
        // this.logContainer.className = 'battle-log';
        // this.container.appendChild(this.logContainer);
    }

    public updateStatus(player: Character, enemy: Character) {
        this.statusContainer.innerHTML = `
            <div class="character-status">
                <h3>${player.name}</h3>
                <p>HP: ${player.hp}/${player.maxHp}</p>
                <p>MP: ${player.mp}/${player.maxMp}</p>
                <p>充能: ${player.charge.toFixed(1)}%</p>
                <p>攻击力: ${player.attack}</p>
                <p>防御力: ${player.defense}</p>
                <p>暴击率: ${(player.critRate * 100).toFixed(1)}%</p>
                <p>暴击伤害: ${(player.critDamage * 100).toFixed(1)}%</p>
                <p>充能效率: ${(player.chargeRate * 100).toFixed(1)}%</p>
                <p>装备技能: ${player.equippedSkill?.name || '无'}</p>
            </div>
            <div class="character-status">
                <h3>${enemy.name}</h3>
                <p>HP: ${enemy.hp}/${enemy.maxHp}</p>
                <p>MP: ${enemy.mp}/${enemy.maxMp}</p>
                <p>充能: ${enemy.charge.toFixed(1)}%</p>
                <p>攻击力: ${enemy.attack}</p>
                <p>防御力: ${enemy.defense}</p>
                <p>暴击率: ${(enemy.critRate * 100).toFixed(1)}%</p>
                <p>暴击伤害: ${(enemy.critDamage * 100).toFixed(1)}%</p>
                <p>充能效率: ${(enemy.chargeRate * 100).toFixed(1)}%</p>
                <p>装备技能: ${enemy.equippedSkill?.name || '无'}</p>
            </div>
        `;
    }

    public addBattleLog(log: BattleLog) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        // 回合信息
        const roundInfo = `<p class="round">回合 ${log.round}</p>`;
        
        // 根据不同情况设置不同的消息类型
        let messageClass = 'message-normal';
        if (log.isCrit) {
            messageClass = 'message-crit';
        }
        if (log.action.includes('使用技能')) {
            messageClass = 'message-skill';
        }
        if (log.isDefeated) {
            messageClass = 'message-defeat';
        }
        
        const message = `<p class="${messageClass}">
            ${log.attacker} ${log.action}，
            造成 ${log.damage} 点伤害！
            ${log.isCrit ? '【暴击】' : ''}
            ${log.isDefeated ? `${log.defender}被击败了！` : ''}
        </p>`;
        
        logEntry.innerHTML = roundInfo + message;
        this.logContainer.appendChild(logEntry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
}