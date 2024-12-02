import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Tag, Typography, Button, Tooltip, message } from 'antd';
import { Player } from '../../class/player';
import { GearItem, InventoryItem, isGearItem, ItemType } from '../../constants/item';
import { ExperimentOutlined, ThunderboltOutlined, InboxOutlined, GoldOutlined } from '@ant-design/icons';
import './index.scss';

const { Text } = Typography;
const { TabPane } = Tabs;

interface InventoryProps {
    visible: boolean;
    onClose: () => void;
}

const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case 'legendary': return '#ff7f50';
        case 'epic': return '#9370db';
        case 'rare': return '#4169e1';
        default: return '#90ee90';
    }
};

const Inventory: React.FC<InventoryProps> = ({ visible, onClose }) => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [gold, setGold] = useState(0);

    useEffect(() => {
        const player = Player.getInstance();
        const inventory = player.inventory;

        setItems(inventory.getItems());
        setGold(inventory.gold);

        const cleanup = inventory.onUpdate(() => {
            setItems(inventory.getItems());
            setGold(inventory.gold);
        });

        return cleanup;
    }, []);

    const filterItemsByType = (type: ItemType) => {
        return items.filter(item => item.item.type === type);
    };

    const handleUseItem = (item: InventoryItem) => {
        const player = Player.getInstance();

        if (item.item.type === ItemType.CONSUMABLE) {
            if (player.inventory.removeItem(item.item.id, 1)) {
                message.success(`使用了 ${item.item.name}`);
            }
        } else if (item.item.type === ItemType.GEAR) {
            message.info(`装备了 ${item.item.name}`);
        }
    };

    const renderItemStats = (item: GearItem) => {
        console.log(item);
        return (
            <div className="gear-stats">
                {item.stats.attack && (
                    <Text type="secondary">攻击力 +{item.stats.attack}</Text>
                )}
                {item.stats.defense && (
                    <Text type="secondary">防御力 +{item.stats.defense}</Text>
                )}
                {item.stats.critRate && (
                    <Text type="secondary">暴击率 +{(item.stats.critRate * 100).toFixed(1)}%</Text>
                )}
                {item.stats.critDamage && (
                    <Text type="secondary">暴击伤害 +{(item.stats.critDamage * 100).toFixed(1)}%</Text>
                )}
                {item.effects?.map((effect, index) => (
                    <Text key={index} type="warning" className="gear-effect">
                        {effect.description}
                    </Text>
                ))}
            </div>
        );
    };

    const renderItemList = (filteredItems: InventoryItem[]) => (
        <List
            className="inventory-list"
            dataSource={filteredItems}
            renderItem={(inventoryItem) => (
                <List.Item className="inventory-item">
                    <div className="item-content">
                        <div className="item-basic">
                            <Tooltip title={inventoryItem.item.description}>
                                <Tag color={getRarityColor(inventoryItem.item.rarity)}>
                                    {inventoryItem.item.name}
                                    {isGearItem(inventoryItem.item) && (
                                        <span className="gear-slot">
                                            ({inventoryItem.item.slot})
                                        </span>
                                    )}
                                </Tag>
                            </Tooltip>
                            {inventoryItem.item.stackable && (
                                <Text className="item-quantity">x{inventoryItem.quantity}</Text>
                            )}
                        </div>
                        {isGearItem(inventoryItem.item) && renderItemStats(inventoryItem.item)}
                    </div>
                    <div className="item-actions">
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleUseItem(inventoryItem)}
                        >
                            {isGearItem(inventoryItem.item) ? '装备' : '使用'}
                        </Button>
                    </div>
                </List.Item>
            )}
        />
    );

    return (
        <Modal
            title={
                <div className="inventory-header">
                    <span>背包</span>
                    <span className="gold-display">
                        <GoldOutlined /> {gold} 金币
                    </span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            className="inventory-modal"
        >
            <Tabs defaultActiveKey="gear">
                <TabPane
                    tab={<><ThunderboltOutlined /> 装备</>}
                    key="gear"
                >
                    {renderItemList(filterItemsByType(ItemType.GEAR))}
                </TabPane>
                <TabPane
                    tab={<><ExperimentOutlined /> 消耗品</>}
                    key="consumable"
                >
                    {renderItemList(filterItemsByType(ItemType.CONSUMABLE))}
                </TabPane>
                <TabPane
                    tab={<><InboxOutlined /> 材料</>}
                    key="material"
                >
                    {renderItemList(filterItemsByType(ItemType.MATERIAL))}
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default Inventory; 