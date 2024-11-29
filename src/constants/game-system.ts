// types.ts

/**
 * 消息类型枚举
 * 用于定义游戏中不同类型的消息
 */
export enum MessageType {
    SYSTEM = 'SYSTEM',       // 系统消息
    COMBAT = 'COMBAT',       // 战斗消息
    REWARD = 'REWARD',       // 奖励消息
    DIALOG = 'DIALOG',       // 对话消息
    ERROR = 'ERROR',         // 错误消息
    ACHIEVEMENT = 'ACHIEVEMENT', // 成就消息
    QUEST = 'QUEST'         // 任务消息
}

/**
 * 事件类型枚举
 * 用于定义游戏中的各种事件
 */
export enum EventType {
    MESSAGE_UPDATED = 'MESSAGE_UPDATED',  // 消息更新
    PLAYER_LEVEL_UP = 'PLAYER_LEVEL_UP',  // 玩家升级
    PLAYER_DEATH = 'PLAYER_DEATH',        // 玩家死亡
    ENEMY_DEATH = 'ENEMY_DEATH',          // 敌人死亡
    ITEM_PICKUP = 'ITEM_PICKUP',          // 拾取物品
    QUEST_COMPLETE = 'QUEST_COMPLETE',    // 任务完成
    SKILL_USED = 'SKILL_USED',            // 技能使用
    GAME_SAVE = 'GAME_SAVE',              // 游戏保存
    GAME_LOAD = 'GAME_LOAD'               // 游戏加载
}

export interface GameMessage {
    type: MessageType;
    content: string;
    timestamp: number;
    data?: any;
}

export interface GameEvent {
    type: EventType;
    data?: any;
}
