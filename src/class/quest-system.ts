import { QuestConfig, QuestStatus, QuestObjectiveType } from '../constants/quest';
import { GameSystem } from './game-system';
import { Player } from './player';
import { QUESTS } from '../data/quests';
import { MessageType } from '../constants/game-system';
import { getItemById } from '../utils/items';
import { StorySystem } from './story-system';

export class QuestSystem {
    private static instance: QuestSystem;
    private questProgress: Map<string, {
        status: QuestStatus;
        objectives: { current: number; required: number }[];
    }> = new Map();

    private constructor() {
        // 初始化任务进度
        QUESTS.forEach(quest => {
            this.questProgress.set(quest.id, {
                status: this.checkQuestAvailability(quest),
                objectives: quest.objectives.map(obj => ({
                    current: 0,
                    required: obj.required
                }))
            });
        });
    }

    public static getInstance(): QuestSystem {
        if (!QuestSystem.instance) {
            QuestSystem.instance = new QuestSystem();
        }
        return QuestSystem.instance;
    }

    private checkQuestAvailability(quest: QuestConfig): QuestStatus {
        const player = Player.getInstance();
        
        // 检查等级要求
        if (player.level < quest.level) {
            return QuestStatus.UNAVAILABLE;
        }

        // 检查前置任务
        if (quest.prerequisiteQuests?.some(
            questId => this.getQuestStatus(questId) !== QuestStatus.FINISHED
        )) {
            return QuestStatus.UNAVAILABLE;
        }

        return QuestStatus.AVAILABLE;
    }

    public getQuestStatus(questId: string): QuestStatus {
        return this.questProgress.get(questId)?.status || QuestStatus.UNAVAILABLE;
    }

    public getAvailableQuests(): QuestConfig[] {
        return QUESTS.filter(quest => 
            this.getQuestStatus(quest.id) === QuestStatus.AVAILABLE
        );
    }

    public getInProgressQuests(): QuestConfig[] {
        return QUESTS.filter(quest => 
            this.getQuestStatus(quest.id) === QuestStatus.IN_PROGRESS
        );
    }

    public getCompletedQuests(): QuestConfig[] {
        return QUESTS.filter(quest => 
            this.getQuestStatus(quest.id) === QuestStatus.FINISHED
        );
    }

    public acceptQuest(questId: string): void {
        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) return;

        const progress = this.questProgress.get(questId);
        if (progress?.status === QuestStatus.AVAILABLE) {
            progress.status = QuestStatus.IN_PROGRESS;
            GameSystem.getInstance().sendMessage(
                MessageType.QUEST,
                `接受任务：${quest.title}`
            );
        }
    }

    public updateQuestProgress(type: QuestObjectiveType, target: string, amount: number = 1) {
        // 遍历所有进行中的任务
        this.questProgress.forEach((progress, questId) => {
            if (progress.status !== QuestStatus.IN_PROGRESS) return;

            const quest = QUESTS.find(q => q.id === questId);
            if (!quest) return;

            // 更新匹配的目标进度
            quest.objectives.forEach((objective, index) => {
                if (objective.type === type && objective.target === target) {
                    const currentProgress = progress.objectives[index];
                    currentProgress.current = Math.min(
                        currentProgress.current + amount,
                        objective.required
                    );
                }
            });

            // 检查是否所有目标都完成了
            const allCompleted = quest.objectives.every((objective, index) => 
                progress.objectives[index].current >= objective.required
            );

            if (allCompleted) {
                // 只发送提示消息，不改变任务状态
                GameSystem.getInstance().sendMessage(
                    MessageType.QUEST,
                    `任务目标已完成：${quest.title}，请返回提交任务`
                );
            }
        });
    }

    // 新增：检查任务是否可以提交
    public canCompleteQuest(questId: string): boolean {
        const quest = QUESTS.find(q => q.id === questId);
        const progress = this.questProgress.get(questId);
        if (!quest || !progress || progress.status !== QuestStatus.IN_PROGRESS) return false;

        return quest.objectives.every((objective, index) => 
            progress.objectives[index].current >= objective.required
        );
    }

    // 修改：提交任务时检查是否满足条件
    public completeQuest(questId: string): void {
        if (!this.canCompleteQuest(questId)) return;

        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) return;

        const progress = this.questProgress.get(questId);
        if (!progress) return;

        const player = Player.getInstance();
        const gameSystem = GameSystem.getInstance();

        // 发放奖励
        if (quest.reward.exp) {
            player.gainExp(quest.reward.exp);
        }
        if (quest.reward.gold) {
            player.inventory.addGold(quest.reward.gold);
        }
        if (quest.reward.items) {
            quest.reward.items.forEach(({ id, quantity }) => {
                const item = getItemById(id);
                if (item) {
                    player.inventory.addItem(item, quantity);
                    gameSystem.sendItemMessage(item, quantity);
                }
            });
        }

        // 更新任务状态
        progress.status = QuestStatus.FINISHED;
        gameSystem.sendMessage(
            MessageType.QUEST,
            `完成任务：${quest.title}`
        );

        // 添加剧情记录
        const storySystem = StorySystem.getInstance();
        if (quest?.story) {
            storySystem.addEntry({
                id: `QUEST_${questId}`,
                title: quest.story.title,
                content: quest.story.content,
                questId
            });
        }

        // 更新所有任务的可用状态
        QUESTS.forEach(q => {
            const qProgress = this.questProgress.get(q.id);
            if (qProgress && qProgress.status === QuestStatus.UNAVAILABLE) {
                qProgress.status = this.checkQuestAvailability(q);
            }
        });
    }

    // 在 BattleScene 中调用
    public onSceneComplete(sceneId: string) {
        this.updateQuestProgress(QuestObjectiveType.COMPLETE_DUNGEON, sceneId);
    }

    public onMonsterKill(monsterId: string) {
        this.updateQuestProgress(QuestObjectiveType.KILL_MONSTER, monsterId);
    }

    public getQuestProgress(questId: string): { 
        status: QuestStatus; 
        objectives: { current: number; required: number }[] 
    } | null {
        return this.questProgress.get(questId) || null;
    }

    public restoreProgress(progress: Array<{
        id: string;
        status: QuestStatus;
        objectives: { current: number; required: number }[];
    }>) {
        progress.forEach(({ id, status, objectives }) => {
            this.questProgress.set(id, { status, objectives });
        });
    }

    public getAllQuestProgress(): Map<string, {
        status: QuestStatus;
        objectives: { current: number; required: number }[];
    }> {
        return this.questProgress;
    }
} 