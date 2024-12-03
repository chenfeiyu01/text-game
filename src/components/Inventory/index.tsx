import React, { useState, useEffect } from 'react';
import { Modal, Tabs, List, Tag, Typography, Button, Tooltip, message } from 'antd';
import { Player } from '../../class/player';
import { GearItem, InventoryItem, ItemType, isGearItem, getRarityColor } from '../../constants/item';
import { ExperimentOutlined, ThunderboltOutlined, InboxOutlined, GoldOutlined } from '@ant-design/icons';
import { StatType, getStatDisplay } from '../../constants/stats';
import './index.scss';

const { Text } = Typography;
const { TabPane } = Tabs;

interface InventoryProps {
    visible: boolean;
    onClose: () => void;
}

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

    const handleEquipItem = (item: InventoryItem) => {
        const player = Player.getInstance();
        if (isGearItem(item.item)) {
            player.equipItem(item.item);
            message.success(`装备了 ${item.item.name}`);
        }
    };

    const handleUseItem = (item: InventoryItem) => {
        const player = Player.getInstance();

        if (item.item.type === ItemType.CONSUMABLE) {
            if (player.inventory.removeItem(item.item.id, 1)) {
                message.success(`使用了 ${item.item.name}`);
            }
        }
    };

    const renderItemStats = (item: GearItem) => {
        return (
            <div className="gear-stats">
                {Object.entries(item.stats).map(([key, value]) => {
                    if (!value) return null;
                    return (
                        <Text key={key} type="secondary">
                            {getStatDisplay(key as StatType, value)}
                        </Text>
                    );
                })}
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
                                <Tag className='item-tag' color={'rgba(0, 0, 0, 0.5)'} style={{ color: getRarityColor(inventoryItem.item.rarity) }}>
                                    {isGearItem(inventoryItem.item) && (
                                        <>
                                            {inventoryItem.item.enhanceLevel > 0 && (
                                                <span className="enhance-level">
                                                    +{inventoryItem.item.enhanceLevel}
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {' '}
                                    {inventoryItem.item.name}
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
                            onClick={() => isGearItem(inventoryItem.item) ? handleEquipItem(inventoryItem) : handleUseItem(inventoryItem)}
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