import { useEffect, useState, useRef } from 'react';
import { GameSystem } from '../../class/game-system';
import { GameMessage, MessageType, EventType, GameEvent } from '../../constants/game-system';
// @ts-ignore
import { FixedSizeList } from 'react-window';
import './index.scss';
import BattleMessage from '../battleMessage';

const MessageDisplay: React.FC = () => {
    const [messages, setMessages] = useState<GameMessage[]>([]);
    const listRef = useRef<FixedSizeList>(null);
    const gameSystem = GameSystem.getInstance();

    // 获取消息类型对应的 CSS 类名
    const getMessageClass = (type: MessageType): string => {
        return type.toLowerCase(); // 确保枚举值与 CSS 类名匹配
    };

    useEffect(() => {
        const handleMessageUpdate = (event: GameEvent) => {
            const newMessages = gameSystem.getRecentMessages();
            setMessages(newMessages);

            // 使用 requestAnimationFrame 确保在下一帧渲染后滚动
            requestAnimationFrame(() => {
                if (newMessages.length > 0) {
                    listRef.current?.scrollToItem(newMessages.length - 1, "end");
                }
            });
        };

        // 订阅消息更新事件
        gameSystem.addEventListener(EventType.MESSAGE_UPDATED, handleMessageUpdate);

        return () => {
            gameSystem.removeEventListener(EventType.MESSAGE_UPDATED, handleMessageUpdate);
        };
    }, []);

    // 当消息更新时自动滚动
    useEffect(() => {
        if (messages.length > 0) {
            listRef.current?.scrollToItem(messages.length - 1, "end");
        }
    }, [messages]);

    return (
        <div className="message-display">
            <FixedSizeList
                ref={listRef}
                height={300}
                width="100%"
                itemCount={messages.length}
                itemSize={50}
            >
                {({ index, style }: { index: number, style: React.CSSProperties }) => {
                    const msg = messages[index];
                    console.log('msg is ', msg);
                    // 如果是战斗日志类型的消息
                    if (msg.type === MessageType.COMBAT) {
                        return (
                            <div style={style}>
                                <BattleMessage msg={msg} />
                            </div>
                        );
                    }
                    // 其他类型的消息保持原样
                    return (
                        <div
                            style={style}
                            className={`message ${getMessageClass(msg.type)}`}
                        >
                            {/* <span className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span> */}
                            <span className="content">{msg.content}</span>
                        </div>
                    );
                }}
            </FixedSizeList>
        </div>
    );
}

export default MessageDisplay;