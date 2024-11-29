/**
 * 导入游戏系统所需的类型和枚举
 */
import { EventType, GameEvent, GameMessage, MessageType } from "../constants/game-system";

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
    private messageLog: GameMessage[] = [];                               // 消息日志
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
    public sendMessage(type: MessageType, content: string, data?: any) {
        const message: GameMessage = {
            type,
            content,
            timestamp: Date.now(),
            data
        };

        this.messageLog.push(message);
        this.logMessage(message);

        // 触发消息更新事件
        this.dispatchEvent({
            type: EventType.MESSAGE_UPDATED,
            data: { message, allMessages: this.messageLog }
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
        let messages = [...this.messageLog];
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

    /**
     * 保存游戏状态
     * @returns 序列化后的存档字符串
     */
    public saveGame(): string {
        const saveData = {
            messages: this.messageLog,
            gameState: Array.from(this.gameState.entries())
        };

        const saveString = JSON.stringify(saveData);
        localStorage.setItem('gameSave', saveString);

        this.sendMessage(MessageType.SYSTEM, '游戏已保存');
        return saveString;
    }

    /**
     * 加载游戏存档
     * @param saveData 可选的存档数据字符串
     */
    public loadGame(saveData?: string) {
        try {
            const data = saveData || localStorage.getItem('gameSave');
            if (!data) {
                throw new Error('没有找到存档数据');
            }

            const parsedData = JSON.parse(data);
            this.messageLog = parsedData.messages;
            this.gameState = new Map(parsedData.gameState);

            this.sendMessage(MessageType.SYSTEM, '游戏已加载');
            this.dispatchEvent({ type: EventType.GAME_LOAD });
        } catch (error) {
            this.handleError('加载存档失败', error);
        }
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
}
