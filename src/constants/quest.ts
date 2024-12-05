import { ItemId } from './item';
import { Monsters } from './monsters';
import { NpcFunction } from './npc';
import { ESCENES } from './scenes';

/**
 * 任务状态枚举
 */
export enum QuestStatus {
    /** 不可接取 */
    UNAVAILABLE = 'UNAVAILABLE',
    /** 可接取 */
    AVAILABLE = 'AVAILABLE',
    /** 进行中 */
    IN_PROGRESS = 'IN_PROGRESS',
    /** 可提交 */
    COMPLETE = 'COMPLETE',
    /** 已完成 */
    FINISHED = 'FINISHED'
}

/**
 * 任务类型枚举
 */
export enum QuestType {
    /** 主线任务 */
    MAIN = 'MAIN',
    /** 支线任务 */
    SIDE = 'SIDE',
    /** 日常任务 */
    DAILY = 'DAILY',
    /** 成就 */
    ACHIEVEMENT = 'ACHIEVEMENT'
}

/**
 * 任务目标类型枚举
 */
export enum QuestObjectiveType {
    /** 击杀怪物 */
    KILL_MONSTER = 'KILL_MONSTER',
    /** 收集物品 */
    COLLECT_ITEM = 'COLLECT_ITEM',
    /** 强化物品 */
    ENHANCE_ITEM = 'ENHANCE_ITEM',
    /** 学习技能 */
    LEARN_SKILL = 'LEARN_SKILL',
    /** 完成副本 */
    COMPLETE_SCENE = 'COMPLETE_SCENE',
    /** 达到等级 */
    REACH_LEVEL = 'REACH_LEVEL',
    /** 对话with NPC */
    TALK_TO_NPC = 'TALK_TO_NPC',
    /** 通关副本 */
    COMPLETE_DUNGEON = 'COMPLETE_DUNGEON',
}

/**
 * 任务目标接口
 */
export interface QuestObjective {
    /** 目标类型 */
    type: QuestObjectiveType;
    /** 目标ID */
    target: Monsters | ItemId | string;
    /** 当前进度 */
    current: number;
    /** 需求数量 */
    required: number;
    /** 目标描述 */
    description: string;
}

/**
 * 任务奖励接口
 */
export interface QuestReward {
    /** 经验值 */
    exp?: number;
    /** 金币 */
    gold?: number;
    /** 物品奖励 */
    items?: {
        /** 物品ID */
        id: ItemId;
        /** 物品数量 */
        quantity: number;
    }[];
}

/**
 * 任务对话接口
 */
export interface QuestDialog {
    npcId: NpcFunction;
    text: string;
    options?: {
        text: string;
        next: string | null;
    }[];
}

/**
 * 任务剧情接口
 */
export interface QuestStory {
    title: string;
    content: string;
}

/**
 * 任务配置接口
 */
export interface QuestConfig {
    /** 任务ID */
    id: string;
    /** 任务标题 */
    title: string;
    /** 任务类型 */
    type: QuestType;
    /** 任务描述 */
    description: string;
    /** 需求等级 */
    level: number;
    /** 任务目标列表 */
    objectives: QuestObjective[];
    /** 任务奖励 */
    reward: QuestReward;
    /** 任务对话 */
    dialogs: {
        /** 接取任务对话 */
        start: QuestDialog[];
        /** 进行中对话 */
        progress: QuestDialog[];
        /** 完成对话 */
        complete: QuestDialog[];
    };
    /** 前置任务 */
    prerequisiteQuests?: string[];
    /** 任务剧情 */
    story?: QuestStory;
}