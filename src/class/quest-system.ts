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

    public updateQuestProgress(questId: string, type: QuestObjectiveType, target: string, amount: number = 1): void {
        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) return;

        const progress = this.questProgress.get(questId);
        if (progress?.status !== QuestStatus.IN_PROGRESS) return;

        quest.objectives.forEach((objective, index) => {
            if (objective.type === type && objective.target === target) {
                const current = progress.objectives[index].current + amount;
                progress.objectives[index].current = Math.min(current, objective.required);

                if (this.checkQuestComplete(questId)) {
                    progress.status = QuestStatus.COMPLETE;
                    GameSystem.getInstance().sendMessage(
                        MessageType.QUEST,
                        `任务可以提交：${quest.title}`
                    );
                }
            }
        });
    }

    private checkQuestComplete(questId: string): boolean {
        const quest = QUESTS.find(q => q.id === questId);
        const progress = this.questProgress.get(questId);
        if (!quest || !progress) return false;

        return progress.objectives.every((obj, index) => 
            obj.current >= quest.objectives[index].required
        );
    }

    public completeQuest(questId: string): void {
        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) return;

        const progress = this.questProgress.get(questId);
        if (progress?.status !== QuestStatus.COMPLETE) return;

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
    }
} 