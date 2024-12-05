import { MessageType } from '../constants/game-system';
import { GameSystem } from './game-system';

export interface StoryEntry {
    id: string;
    title: string;
    content: string;
    // timestamp: number;
    questId?: string;
    isRead: boolean;
}

const INIT_STORY_CONTENT = `    在边境小镇晨星村，今天是你期待已久的成年日。
在这片大陆上，每个年满十八岁的青年都要在成年日这天前往冒险者协会登记注册，这不仅是一项传统，更是一种荣耀。无数传奇冒险者的故事都是从这一天开始的。
清晨，你收拾好简单的行囊，带上父亲留下的遗物，离开了生活多年的家。

    就在你准备启程的那一刻，村里的老占卜师克莱拉匆忙地拦住了你。
"等一下，年轻人，"她浑浊的眼睛中闪过一丝忧虑，"我在今晨的占卜中看到了不寻常的征兆。最近，边境地区有许多村民报告说在夜晚看到奇怪的光芒，还有人说森林里出现了前所未见的怪物..."
"收下这个，愿它能在危险时刻保护你。记住，当你看到紫色的光芒时，一定要格外小心。"`

export class StorySystem {
    private static instance: StorySystem;
    private entries: StoryEntry[] = [
        {
            id: 'INIT_STORY',
            title: '冒险的黎明',
            content: INIT_STORY_CONTENT,
            isRead: false
        }
    ];
    private unlockedEntries = new Set<string>();

    public static getInstance(): StorySystem {
        if (!StorySystem.instance) {
            StorySystem.instance = new StorySystem();
        }
        return StorySystem.instance;
    }

    public addEntry(entry: Omit<StoryEntry, 'timestamp' | 'isRead'>) {
        if (this.unlockedEntries.has(entry.id)) return;

        this.unlockedEntries.add(entry.id);
        this.entries.push({
            ...entry,
            isRead: false
        });

        GameSystem.getInstance().sendMessage(
            MessageType.STORY,
            `解锁新的剧情：${entry.title}`
        );
    }

    public markAsRead(id: string) {
        const entry = this.entries.find(e => e.id === id);
        if (entry) {
            entry.isRead = true;
        }
    }

    public getEntries() {
        return this.entries;
    }

    public getUnreadCount() {
        return this.entries.filter(e => !e.isRead).length;
    }

    public serialize() {
        return {
            entries: this.entries,
            unlockedEntries: Array.from(this.unlockedEntries)
        };
    }

    public deserialize(data: ReturnType<StorySystem['serialize']>) {
        this.entries = data.entries;
        this.unlockedEntries = new Set(data.unlockedEntries);
    }
} 