import React from 'react';
import { Tooltip, Tag } from 'antd';
import { Item, isGearItem, getRarityColor, getRarityTagColor, RARITY_CONFIG } from '../../constants/item';
import { STAT_CONFIG, StatType, formatStatValue } from '../../constants/stats';
import './index.scss';

interface ItemTooltipProps {
    item: Item;
    quantity?: number;
    children?: React.ReactNode;
}

export const ItemTooltip: React.FC<ItemTooltipProps> = ({ item, quantity, children }) => {
    return (
        <Tooltip
            title={
                <div className="item-tooltip">
                    <div className="item-header">
                        <span style={{ color: getRarityColor(item.rarity) }}>
                            {item.name}
                            {isGearItem(item) && item.enhanceLevel > 0 && (
                                <span className="enhance-level">+{item.enhanceLevel}</span>
                            )}
                        </span>
                        <Tag color={getRarityTagColor(item.rarity)}>
                            {RARITY_CONFIG[item.rarity].name}
                        </Tag>
                    </div>
                    <div className="item-description">
                        {item.description}
                    </div>
                    {isGearItem(item) && item.stats && (
                        <div className="item-stats">
                            {Object.entries(item.stats).map(([stat, value]) => (
                                <div key={stat} className="stat-line">
                                    {STAT_CONFIG[stat as StatType].name}: +{formatStatValue(stat as StatType, value)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            }
            placement="right"
        >
            {children || (
                <div className="reward-item">
                    <span className="reward-icon">🎁</span>
                    <span style={{ color: getRarityColor(item.rarity) }}>
                        {item.name}
                    </span>
                    {quantity && <span className="reward-quantity">x{quantity}</span>}
                </div>
            )}
        </Tooltip>
    );
}; 