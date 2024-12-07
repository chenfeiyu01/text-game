import { ItemId } from "./item";

/**
 * 战斗系统相关常量和接口定义
 */
export enum EBattleResult {
    /** 战斗胜利 */
    VICTORY = 'VICTORY',
    /** 战斗失败 */ 
    DEFEAT = 'DEFEAT',
    /** 战斗进行中 */
    ONGOING = 'ONGOING'
}

/**
 * 战斗日志记录接口
 * @interface
 * @description 记录战斗过程中的每个回合的详细信息
 */
export interface BattleLog {
    /** 当前回合数 */
    round: number;
    /** 本回合动作的描述 */
    action: string;
    /** 造成的伤害值 */
    damage: number;
    /** 攻击方名称 */
    attacker: string;
    /** 防御方名称 */
    defender: string;
    /** 攻击方当前生命值 */
    attackerHp: number;
    /** 防御方当前生命值 */
    defenderHp: number;
    /** 是否触发暴击 */
    isCrit: boolean;
    /** 是否击败对手 */
    isDefeated: boolean;
}

/**
 * 战斗奖励接口
 * @interface
 * @description 定义战斗胜利后获得的奖励内容
 */
export interface BattleReward {
    /** 获得的经验值 */
    exp: number;
    /** 获得的金币数量 */
    gold?: number;
    /** 获得的物品ID列表 */
    items?: ItemId[];
}