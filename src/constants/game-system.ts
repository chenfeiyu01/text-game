/**
 * 消息类型枚举
 * @description 用于定义游戏中不同类型的消息
 * @enum {string}
 */
export enum MessageType {
    /** 系统消息 */
    SYSTEM = 'SYSTEM',       
    /** 战斗消息 */
    COMBAT = 'COMBAT',       
    /** 奖励消息 */
    REWARD = 'REWARD',       
    /** 对话消息 */
    DIALOG = 'DIALOG',       
    /** 错误消息 */
    ERROR = 'ERROR',         
    /** 成就消息 */
    ACHIEVEMENT = 'ACHIEVEMENT', 
    /** 任务消息 */
    QUEST = 'QUEST',         
    /** 剧情消息 */
    STORY = 'STORY'         
}

/**
 * 事件类型枚举
 * @description 用于定义游戏中的各种事件
 * @enum {string}
 */
export enum EventType {
    /** 消息更新事件 */
    MESSAGE_UPDATED = 'MESSAGE_UPDATED',  
    /** 玩家升级事件 */
    PLAYER_LEVEL_UP = 'PLAYER_LEVEL_UP',  
    /** 玩家死亡事件 */
    PLAYER_DEATH = 'PLAYER_DEATH',        
    /** 敌人死亡事件 */
    ENEMY_DEATH = 'ENEMY_DEATH',          
    /** 拾取物品事件 */
    ITEM_PICKUP = 'ITEM_PICKUP',          
    /** 任务完成事件 */
    QUEST_COMPLETE = 'QUEST_COMPLETE',    
    /** 技能使用事件 */
    SKILL_USED = 'SKILL_USED',            
    /** 游戏保存事件 */
    GAME_SAVE = 'GAME_SAVE',              
    /** 游戏加载事件 */
    GAME_LOAD = 'GAME_LOAD'               
}

/**
 * 游戏消息接口
 * @interface
 * @description 定义了游戏消息的数据结构
 */
export interface GameMessage {
    /** 消息类型 */
    type: MessageType;
    /** 消息内容 */
    content: string;
    /** 消息时间戳 */
    timestamp: number;
    /** 额外数据 */
    data?: any;
}

/**
 * 游戏事件接口
 * @interface
 * @description 定义了游戏事件的数据结构
 */
export interface GameEvent {
    /** 事件类型 */
    type: EventType;
    /** 事件数据 */
    data?: any;
}
