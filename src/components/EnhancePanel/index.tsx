import React, { useState } from 'react';
import { EnhanceNpc } from '../../class/npc';
import { Player } from '../../class/player';
import { Button, Card, message, Progress, Tooltip } from 'antd';
import { calculateEnhanceCost, ENHANCE_GROWTH_RATE, GearItem, isGearItem, ItemId } from '../../constants/item';
import { getEnhanceSuccessRate } from '../../constants/item';
import './index.scss';

interface EnhancePanelProps {
    npc: EnhanceNpc;
}

export const EnhancePanel: React.FC<EnhancePanelProps> = ({ npc }) => {
    const [selectedItemId, setSelectedItemId] = useState<ItemId | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const player = Player.getInstance();
    const enhanceableItems = player.inventory.getItems()
        .filter(item => isGearItem(item.item) && item.item.isEnhanceable);

    const handleEnhance = (itemId: ItemId) => {
        const result = npc.enhanceEquipment(player, itemId);
        if (result.success) {
            message.success(result.message);
            setUpdateTrigger(prev => prev + 1);
        } else {
            message.error(result.message);
        }
    };

    const selectedItem = selectedItemId 
        ? enhanceableItems.find(item => item.item.id === selectedItemId)?.item as GearItem
        : null;

    return (
        <div className="enhance-panel">
            <div className="equipment-list">
                {enhanceableItems.map(({ item }) => {
                    const gearItem = item as GearItem;
                    const isSelected = selectedItemId === item.id;
                    return (
                        <Card
                            key={item.id}
                            className={`equipment-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedItemId(item.id)}
                        >
                            <div className="item-name">
                                {item.name}
                                {gearItem.enhanceLevel > 0 && (
                                    <span className="enhance-level">+{gearItem.enhanceLevel}</span>
                                )}
                            </div>
                            <div className="item-stats">
                                {Object.entries(gearItem.stats).map(([key, value]) => (
                                    value ? (
                                        <div key={key} className="stat-item">
                                            <span>{getStatName(key)}</span>
                                            <span>{formatStatValue(value)}</span>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="enhance-details">
                <div className="preview-section">
                    <h3>强化预览</h3>
                    {selectedItem ? (
                        <>
                            <div className="success-rate">
                                <span>成功率</span>
                                <Progress
                                    percent={getEnhanceSuccessRate(selectedItem.enhanceLevel) * 100}
                                    status={getEnhanceSuccessRate(selectedItem.enhanceLevel) < 0.5 ? "exception" : "active"}
                                />
                            </div>
                            <div className="cost">
                                <span>强化费用</span>
                                <span className="gold">{calculateEnhanceCost(selectedItem)} 金币</span>
                            </div>
                            <div className="stats-preview">
                                {Object.entries(selectedItem.stats).map(([key, value]) => {
                                    if (!value) return null;
                                    const growth = value * ENHANCE_GROWTH_RATE[key as keyof typeof ENHANCE_GROWTH_RATE];
                                    return (
                                        <div key={key} className="preview-stat">
                                            <span className="stat-name">{getStatName(key)}</span>
                                            <div className="stat-change">
                                                <span className="current">{formatStatValue(value)}</span>
                                                <span className="arrow">→</span>
                                                <span className="after">{formatStatValue(value + growth)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="no-selection">
                            <span>请选择一个装备以查看强化详情。</span>
                        </div>
                    )}
                </div>
                <Tooltip 
                    title={selectedItem && player.inventory.gold < calculateEnhanceCost(selectedItem) ? "金币不足" : ""}
                >
                    <Button
                        type="primary"
                        className="enhance-button"
                        disabled={!selectedItem || player.inventory.gold < calculateEnhanceCost(selectedItem)}
                        onClick={() => selectedItem && handleEnhance(selectedItem.id)}
                    >
                        强化
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};

function getStatName(key: string): string {
    const statNames: Record<string, string> = {
        attack: '攻击力',
        defense: '防御力',
        critRate: '暴击率',
        critDamage: '暴击伤害'
    };
    return statNames[key] || key;
}

function formatStatValue(value: number): string {
    console.log('value', value);
    if (value < 1) {
        return `${(value * 100).toFixed(1)}%`;
    }
    return Math.round(value).toString();
} 