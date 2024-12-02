import React, { useState, useEffect } from 'react';
import { Modal, Card, List, Tag, Typography, Button, Tooltip, message } from 'antd';
import { Player } from '../../class/player';
import { InventoryItem, ItemType } from '../../constants/item';
import './index.scss';

const { Text } = Typography;

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

    const handleUseItem = (item: InventoryItem) => {
        const player = Player.getInstance();
        
        if (item.item.type === 'consumable') {
            if (player.inventory.removeItem(item.item.id, 1)) {
                // 处理消耗品效果
                message.success(`使用了 ${item.item.name}`);
            }
        } else if (item.item.type === ItemType.GEAR) {
            // 装备逻辑
            message.info(`装备了 ${item.item.name}`);
        } else {
            message.info(`这个物品不能使用`);
        }
    };

    const handleDiscardItem = (item: InventoryItem) => {
        Modal.confirm({
            title: '丢弃物品',
            content: `确定要丢弃 ${item.item.name} 吗？`,
            onOk() {
                const player = Player.getInstance();
                if (player.inventory.removeItem(item.item.id, 1)) {
                    message.success(`丢弃了 ${item.item.name}`);
                }
            }
        });
    };

    return (
        <Modal
            title="背包"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            className="inventory-modal"
        >
            <div className="gold-display">
                <Text>金币: {gold}</Text>
            </div>
            <List
                dataSource={items}
                renderItem={(inventoryItem) => (
                    <List.Item
                        actions={[
                            <Button 
                                size="small" 
                                onClick={() => handleUseItem(inventoryItem)}
                            >
                                使用
                            </Button>,
                            <Button 
                                size="small" 
                                danger 
                                onClick={() => handleDiscardItem(inventoryItem)}
                            >
                                丢弃
                            </Button>
                        ]}
                    >
                        <div className="item-entry">
                            <Tooltip title={inventoryItem.item.description}>
                                <Tag color={getRarityColor(inventoryItem.item.rarity)}>
                                    {inventoryItem.item.name}
                                </Tag>
                            </Tooltip>
                            <Text className="item-quantity">x{inventoryItem.quantity}</Text>
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default Inventory; 