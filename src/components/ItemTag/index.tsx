import React from 'react';
import { Tag } from 'antd';
import { Item, isGearItem, getRarityTagColor } from '../../constants/item';
import './index.scss';

interface ItemTagProps {
    item: Item;
    bordered?: boolean;
}

export const ItemTag: React.FC<ItemTagProps> = ({ item, bordered = false }) => {
    return (
        <Tag className='item-tag' bordered={bordered} color={getRarityTagColor(item.rarity)}>
            {isGearItem(item) && item.enhanceLevel > 0 && (
                <span className="enhance-level">
                    +{item.enhanceLevel}
                </span>
            )}
            {' '}
            {item.name}
        </Tag>
    );
}; 