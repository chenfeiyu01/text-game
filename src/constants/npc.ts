export enum NpcFunction {
    SHOP = 'shop',           // 商店功能
    ENHANCE = 'enhance',     // 强化装备
    SKILL = 'skill',         // 技能学习
    QUEST = 'quest',         // 任务
    STORAGE = 'storage'      // 仓库
}

export interface NpcDialog {
    id: string;
    text: string;
    options?: NpcDialogOption[];
}

export interface NpcDialogOption {
    text: string;
    nextDialogId?: string;
    action?: () => void;
}

export interface NpcConfig {
    id: string;
    name: string;
    description: string;
    functions: NpcFunction[];
    dialogs: Record<string, NpcDialog>;
    defaultDialogId: string;
} 