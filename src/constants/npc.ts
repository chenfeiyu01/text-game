export enum NpcFunction {
    SHOP = 'shop',           // 商店功能
    ENHANCE = 'enhance',     // 强化装备
    SKILL = 'skill',         // 技能学习
    QUEST = 'quest',         // 任务
    STORAGE = 'storage'      // 仓库
}

export const NPC_FUNCTION_NAMES: Record<NpcFunction, string> = {
    [NpcFunction.SHOP]: '杂货商人',
    [NpcFunction.ENHANCE]: '铁匠',
    [NpcFunction.SKILL]: '技能导师',
    [NpcFunction.QUEST]: '任务公会',
    [NpcFunction.STORAGE]: '仓库管理员'
};


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