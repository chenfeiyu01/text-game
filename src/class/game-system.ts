/**
 * 导入游戏系统所需的类型和枚举
 */
import { BattleLog } from "../constants/battle";
import { EventType, GameEvent, GameMessage, MessageType } from "../constants/game-system";
import { getRarityColor, Item } from "../constants/item";

/**
 * 事件回调函数的类型定义
 */
export type EventCallback = (event: GameEvent) => void;

/**
 * 游戏系统类
 * 实现了单例模式,用于管理游戏的核心功能
 */
export class GameSystem {
    private static instance: GameSystem;                                   // 单例实例
    private messages: GameMessage[] = [];                               // 消息日志
    private messageCallbacks: Set<() => void> = new Set();               // 消息更新回调函数集合
    private eventListeners: Map<EventType, Set<EventCallback>> = new Map(); // 事件监听器映射
    private gameState: Map<string, any> = new Map();                     // 游戏状态存储
    private debugMode: boolean = false;                                   // 调试模式标志

    /**
     * 私有构造函数,确保单例模式
     */
    private constructor() { }

    /**
     * 获取GameSystem的单例实例
     * @returns GameSystem实例
     */
    public static getInstance(): GameSystem {
        if (!GameSystem.instance) {
            GameSystem.instance = new GameSystem();
        }
        return GameSystem.instance;
    }

    /**
     * 发送游戏消息
     * @param type 消息类型
     * @param content 消息内容
     * @param data 可选的附加数据
     */
    public sendMessage(type: MessageType, content: string, data?: BattleLog) {
        const message: GameMessage = {
            type,
            content,
            timestamp: Date.now(),
            data
        };

        this.messages.push(message);
        this.notifyMessageUpdate();

        // 触发消息更新事件
        this.dispatchEvent({
            type: EventType.MESSAGE_UPDATED,
            data: { message, allMessages: this.messages }
        });

        if (type === MessageType.ERROR) {
            this.handleError(content, data);
        }
    }

    /**
     * 记录消息到控制台
     * @param message 要记录的消息对象
     */
    private logMessage(message: GameMessage) {
        const timeString = new Date(message.timestamp).toLocaleTimeString();
        const prefix = `[${message.type}][${timeString}]`;

        switch (message.type) {
            case MessageType.ERROR:
                console.error(`${prefix} ${message.content}`);
                break;
            case MessageType.SYSTEM:
                console.info(`${prefix} ${message.content}`);
                break;
            default:
                console.log(`${prefix} ${message.content}`);
        }
    }

    /**
     * 获取最近的消息记录
     * @param count 要获取的消息数量
     * @param type 可选的消息类型过滤
     * @returns 消息数组
     */
    public getRecentMessages(count?: number, type?: MessageType): GameMessage[] {
        let messages = [...this.messages];
        if (type) {
            messages = messages.filter(msg => msg.type === type);
        }
        return count ? messages.slice(-count) : messages;
    }

    /**
     * 添加事件监听器
     * @param type 事件类型
     * @param callback 回调函数
     */
    public addEventListener(type: EventType, callback: EventCallback) {
        if (!this.eventListeners.has(type)) {
            this.eventListeners.set(type, new Set());
        }
        this.eventListeners.get(type)!.add(callback);
    }

    /**
     * 移除事件监听器
     * @param type 事件类型
     * @param callback 要移除的回调函数
     */
    public removeEventListener(type: EventType, callback: EventCallback) {
        const listeners = this.eventListeners.get(type);
        if (listeners) {
            listeners.delete(callback);
        }
    }

    /**
     * 触发事件
     * @param event 要触发的事件对象
     */
    public dispatchEvent(event: GameEvent) {
        const listeners = this.eventListeners.get(event.type);
        console.log(`正在分发事件 ${event.type}，监听器数量: ${listeners?.size || 0}`);

        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(event);
                } catch (error) {
                    this.handleError('事件处理器错误', error);
                }
            });
        }
    }

    /**
     * 设置游戏状态
     * @param key 状态键
     * @param value 状态值
     */
    public setState(key: string, value: any) {
        this.gameState.set(key, value);
        this.dispatchEvent({
            type: EventType.GAME_SAVE,
            data: { key, value }
        });
    }

    /**
     * 获取游戏状态
     * @param key 状态键
     * @param defaultValue 默认值
     * @returns 状态值或默认值
     */
    public getState<T>(key: string, defaultValue?: T): T | undefined {
        return this.gameState.has(key)
            ? this.gameState.get(key)
            : defaultValue;
    }

    /**
     * 处理错误
     * @param message 错误消息
     * @param error 错误对象
     */
    private handleError(message: string, error?: any) {
        if (this.debugMode) {
            console.error('Game Error:', message, error);
        }
        // 可以在这里添加错误上报逻辑
    }

    /**
     * 设置调试模式
     * @param enabled 是否启用调试模式
     */
    public setDebugMode(enabled: boolean) {
        this.debugMode = enabled;
        this.sendMessage(
            MessageType.SYSTEM,
            `调试模式已${enabled ? '开启' : '关闭'}`
        );
    }


    // 性能监控相关
    private performanceMarks: Map<string, number> = new Map();

    /**
     * 开始性能标记
     * @param markName 标记名称
     */
    public startPerformanceMark(markName: string) {
        this.performanceMarks.set(markName, performance.now());
    }

    /**
     * 结束性能标记并计算持续时间
     * @param markName 标记名称
     * @returns 持续时间(毫秒)
     */
    public endPerformanceMark(markName: string): number {
        const startTime = this.performanceMarks.get(markName);
        if (!startTime) {
            this.handleError(`性能标记 ${markName} 未找到`);
            return 0;
        }

        const duration = performance.now() - startTime;
        this.performanceMarks.delete(markName);

        if (this.debugMode) {
            this.sendMessage(
                MessageType.SYSTEM,
                `性能标记 ${markName}: ${duration.toFixed(2)}ms`
            );
        }

        return duration;
    }

    /**
     * 恢复消息历史
     * @param messages 消息历史
     */
    public restoreMessages(messages: GameMessage[]): void {
        this.messages = [...messages];
        this.notifyMessageUpdate();
    }

    /**
     * 清空消息
     */
    public clearMessages(): void {
        this.messages = [];
        this.notifyMessageUpdate();
    }

    /**
     * 添加消息更新回调
     * @param callback 回调函数
     * @returns 移除回调的函数
     */
    public onMessageUpdate(callback: () => void): () => void {
        this.messageCallbacks.add(callback);
        return () => this.messageCallbacks.delete(callback);
    }

    /**
     * 通知消息更新
     */
    private notifyMessageUpdate(): void {
        this.messageCallbacks.forEach(callback => callback());
    }

    /**
     * 发送物品获得消息
     * @param item 获得的物品
     * @param quantity 物品数量，默认为1
     */
    public sendItemMessage(item: Item, quantity: number = 1): void {
        const itemText = `<span style="background-color: rgba(0,0,0,0.3);color: ${getRarityColor(item.rarity)}">${item.name}</span>`;
        const quantityText = quantity > 1 ? ` x${quantity}` : '';
        this.sendMessage(MessageType.REWARD, `获得物品：${itemText}${quantityText}！`);
    }
}
