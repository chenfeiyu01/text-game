import React from 'react';
import { Card, Button, message } from 'antd';
import { EventConfig, EventResultType } from '../../constants/scenes';
import { Player } from '../../class/player';
import { RandomUtils } from '../../utils/random';
import { getItemById } from '../../utils/items';
import './index.scss';

interface EventPanelProps {
    event: EventConfig;
    onComplete: () => void;
}

export const EventPanel: React.FC<EventPanelProps> = ({ event, onComplete }) => {
    const handleOptionClick = (optionIndex: number) => {
        const option = event.options[optionIndex];
        const result = RandomUtils.getWeightedResult(option.results);
        const player = Player.getInstance();

        // 处理事件结果
        switch (result.type) {
            case EventResultType.BUFF:
                player.addBuff(result.stat!, result.value, result.duration!);
                break;

            case EventResultType.DEBUFF:
                player.addBuff(result.stat!, result.value, result.duration!);
                break;

            case EventResultType.ITEM:
                const item = getItemById(result.itemId!);
                if (item) {
                    player.inventory.addItem(item, result.value);
                }
                break;

            case EventResultType.HEAL:
                player.heal(player.maxHp * result.value);
                break;

            case EventResultType.DAMAGE:
                player.takeDamage(player.maxHp * result.value);
                break;

            case EventResultType.GOLD:
                player.inventory.addGold(result.value);
                break;

        }

        message.success(result.description);
        
        // 除了特殊事件（如隐藏Boss）外，所有事件选择后都应该继续
        // if (result.type !== EventResultType.HIDDEN_BOSS) {
            onComplete();
        // }
    };

    return (
        <Card title={event.title} className="event-panel">
            <div className="event-content">
                <p className="event-description">{event.description}</p>
                <div className="event-options">
                    {event.options.map((option, index) => (
                        <Button
                            key={index}
                            onClick={() => handleOptionClick(index)}
                            className="event-option"
                        >
                            {option.text}
                        </Button>
                    ))}
                </div>
            </div>
        </Card>
    );
}; 