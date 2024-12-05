import React, { useState, useEffect } from 'react';
import { Tabs, List, Button, message, Tooltip } from 'antd';
import { ShopNpc } from '../../class/npc';
import { Player } from '../../class/player';
import { ItemTag } from '../ItemTag';
import { ItemTooltip } from '../ItemTooltip';
import { SHOP_ITEMS } from '../../data/items/shop';
import { GoldOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import './index.scss';
import { ItemId } from '../../constants/item';

const { TabPane } = Tabs;

interface ShopPanelProps {
    npc: ShopNpc;
}

export const ShopPanel: React.FC<ShopPanelProps> = ({ npc }) => {
    const player = Player.getInstance();
    const [gold, setGold] = useState(player.inventory.gold);

    useEffect(() => {
        const cleanup = player.inventory.onUpdate(() => {
            setGold(player.inventory.gold);
        });
        return cleanup;
    }, []);

    const handleBuy = (itemId: string, price: number) => {
        if (gold < price) {
            message.error('金币不足！');
            return;
        }

        const item = SHOP_ITEMS[itemId as keyof typeof SHOP_ITEMS];
        if (!item) return;

        player.inventory.addItem(item);
        player.inventory.removeGold(price);
        message.success(`购买了 ${item.name}`);
    };

    const handleSell = (itemId: ItemId) => {
        const item = player.inventory.getItems().find(i => i.item.id === itemId);
        if (!item) return;

        const sellPrice = Math.floor(item.item.price * 0.7); // 7折售卖
        player.inventory.removeItem(itemId, item.quantity);
        player.inventory.addGold(sellPrice);
        message.success(`售出 ${item.item.name}，获得 ${sellPrice} 金币`);
    };

    return (
        <div className="shop-panel">
            <div className="shop-header">
                <span className="gold">
                    <GoldOutlined /> {gold} 金币
                </span>
            </div>

            <Tabs defaultActiveKey="buy">
                <TabPane 
                    tab={<><ShoppingCartOutlined /> 购买</>}
                    key="buy"
                >
                    <List
                        className="shop-list"
                        dataSource={Object.entries(SHOP_ITEMS)}
                        renderItem={([id, item]) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="primary"
                                        onClick={() => handleBuy(id, item.price)}
                                        disabled={gold < item.price}
                                    >
                                        购买 ({item.price} 金币)
                                    </Button>
                                ]}
                            >
                                <ItemTooltip item={item}>
                                    <div className="shop-item">
                                        <ItemTag item={item} />
                                    </div>
                                </ItemTooltip>
                            </List.Item>
                        )}
                    />
                </TabPane>

                <TabPane 
                    tab={<><ShoppingOutlined /> 出售</>}
                    key="sell"
                >
                    <List
                        className="shop-list"
                        dataSource={player.inventory.getItems()}
                        renderItem={({ item, quantity }) => (
                            <List.Item
                                actions={[
                                    <Button
                                        onClick={() => handleSell(item.id)}
                                    >
                                        出售 ({Math.floor(item.price * 0.7)} 金币)
                                    </Button>
                                ]}
                            >
                                <ItemTooltip item={item}>
                                    <div className="shop-item">
                                        <ItemTag item={item} />
                                        <span className="quantity">x{quantity}</span>
                                    </div>
                                </ItemTooltip>
                            </List.Item>
                        )}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}; 