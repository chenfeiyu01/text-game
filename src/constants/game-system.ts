// types.ts
export enum MessageType {
    SYSTEM = 'SYSTEM',
    COMBAT = 'COMBAT',
    REWARD = 'REWARD',
    DIALOG = 'DIALOG',
    ERROR = 'ERROR',
    ACHIEVEMENT = 'ACHIEVEMENT',
    QUEST = 'QUEST'
}

export enum EventType {
    PLAYER_LEVEL_UP = 'PLAYER_LEVEL_UP',
    PLAYER_DEATH = 'PLAYER_DEATH',
    ENEMY_DEATH = 'ENEMY_DEATH',
    ITEM_PICKUP = 'ITEM_PICKUP',
    QUEST_COMPLETE = 'QUEST_COMPLETE',
    SKILL_USED = 'SKILL_USED',
    GAME_SAVE = 'GAME_SAVE',
    GAME_LOAD = 'GAME_LOAD'
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
