import React, { useState } from 'react';
import { Button, InputNumber, Select, Space, Modal, Tabs, message } from 'antd';
import { BugOutlined } from '@ant-design/icons';
import { Player } from '../../class/player';
import { GEARS } from '../../data/items/gears';
import { CONSUMABLES } from '../../data/items/consumables';
import { STAT_CONFIG, StatType } from '../../constants/stats';
import { GearItemId, ConsumableItemId, ItemId } from '../../constants/item';
import { ITEMS } from '../../data/items';
import './index.scss';

const { TabPane } = Tabs;

export const DevTools: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const player = Player.getInstance();

    // 属性修改
    const handleStatChange = (statType: StatType, value: number) => {
        player.setBaseStat(statType, value);
        message.success(`已修改${StatType[statType]}为${value}`);
    };

    // 等级修改
    const handleLevelChange = (value: number) => {
        for(let i = 0; i < value; i++) {
            player.gainExp(player.expNeeded);
        }
        message.success(`等级已调整为${player.level}`);
    };

    // 添加物品
    const handleAddItem = (itemId: ItemId, quantity: number = 1) => {
        const item = ITEMS[itemId];
        if (item) {
            player.inventory.addItem(item, quantity);
            message.success(`已添加 ${item.name} x${quantity}`);
        }
    };

    // 添加金币
    const handleGoldChange = (value: number) => {
        player.inventory.addGold(value);
        message.success(`已添加 ${value} 金币`);
    };

    return (
        <>
            <Button
                icon={<BugOutlined />}
                onClick={() => setVisible(true)}
                className="dev-tools-trigger"
            >
                开发工具
            </Button>

            <Modal
                title="开发者工具"
                open={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                width={800}
            >
                <Tabs>
                    <TabPane tab="属性修改" key="stats">
                        <div className="stat-adjusters">
                            {Object.values(StatType).map(stat => (
                                <div key={stat} className="stat-item">
                                    <span>{STAT_CONFIG[StatType[stat]].name}</span>
                                    <InputNumber
                                        defaultValue={player.getBaseStat(stat)}
                                        onChange={(value) => handleStatChange(stat, value || 0)}
                                    />
                                </div>
                            ))}
                        </div>
                    </TabPane>

                    <TabPane tab="等级经验" key="level">
                        <Space direction="vertical">
                            <div>
                                <span>当前等级: {player.level}</span>
                                <InputNumber
                                    min={1}
                                    max={99}
                                    defaultValue={player.level}
                                    onChange={(value) => handleLevelChange(value || 0)}
                                />
                            </div>
                            <div>
                                <span>经验值: {player.exp}/{player.expNeeded}</span>
                                <Button 
                                    onClick={() => player.gainExp(player.expNeeded)}
                                >
                                    升级
                                </Button>
                            </div>
                        </Space>
                    </TabPane>

                    <TabPane tab="物品发放" key="items">
                        <div className="item-grant">
                            <Select
                                style={{ width: 200 }}
                                placeholder="选择物品"
                                onChange={(value) => handleAddItem(value)}
                                options={[
                                    ...Object.values(GEARS).map(item => ({
                                        label: item.name,
                                        value: item.id
                                    })),
                                    ...Object.values(CONSUMABLES).map(item => ({
                                        label: item.name,
                                        value: item.id
                                    }))
                                ]}
                            />
                            <InputNumber
                                min={1}
                                defaultValue={1}
                                onChange={(value) => handleAddItem(value || 1)}
                            />
                        </div>
                    </TabPane>

                    <TabPane tab="金币" key="gold">
                        <div className="gold-grant">
                            <Space>
                                <span>当前金币: {player.inventory.gold}</span>
                                <InputNumber
                                    min={0}
                                    placeholder="输入金币数量"
                                    onChange={value => handleGoldChange(value || 0)}
                                />
                                <Button onClick={() => handleGoldChange(10000)}>
                                    +10000
                                </Button>
                                <Button onClick={() => handleGoldChange(100000)}>
                                    +100000
                                </Button>
                            </Space>
                        </div>
                    </TabPane>
                </Tabs>
            </Modal>
        </>
    );
}; 