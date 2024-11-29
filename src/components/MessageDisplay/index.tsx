import { useEffect, useState } from 'react';
import { GameSystem } from '../../class/game-system';
import { GameMessage, MessageType } from '../../constants/game-system';
import './index.scss';

const MessageDisplay: React.FC = () => {
    const [messages, setMessages] = useState<GameMessage[]>([]);
    const gameSystem = GameSystem.getInstance();

    useEffect(() => {
        // 定时获取最新消息
        const timer = setInterval(() => {
            const recentMessages = gameSystem.getRecentMessages(10);
            setMessages(recentMessages);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="message-display">
            {messages.map((msg, index) => (
                <div
                    key={msg.timestamp + index}
                    className={`message ${msg.type.toLowerCase()}`}
                >
                    <span className="timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="content">{msg.content}</span>
                </div>
            ))}
        </div>
    );
}

export default MessageDisplay;