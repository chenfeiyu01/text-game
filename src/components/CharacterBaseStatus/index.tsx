import React, { useState, useEffect } from 'react';
import { Character } from '../../class/character';
import { Progress, Modal, Button, Tabs, Tooltip } from 'antd';
import { GearSlot, GearItem } from '../../constants/item';
import './index.scss';

interface CharacterBaseStatusProps {
    character: Character;
}

// 装备槽位的中文映射
const GEAR_SLOT_NAMES: Record<GearSlot, string> = {
    weapon: '武器',
    armor: '护甲',
    accessory: '饰品'
};

// 属性的中文映射
const STAT_NAMES: Record<string, string> = {
    attack: '攻击力',
    defense: '防御力',
    critRate: '暴击率',
    critDamage: '暴击伤害'
};

const CharacterBaseStatus: React.FC<CharacterBaseStatusProps> = ({ character }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const cleanup = character.setStateChangeCallback(() => {
            setUpdateTrigger(prev => prev + 1);
        });
        return cleanup;
    }, [character]);

    // 计算经验值百分比
    const expPercentage = Math.floor((character.exp / character.expNeeded) * 100);

    // 渲染装备属性
    const renderGearStats = (stats: GearItem['stats']) => {
        return Object.entries(stats).map(([key, value]) => {
            if (!value) return null;
            const statName = STAT_NAMES[key];
            const formattedValue = key.includes('crit') 
                ? `+${(value * 100).toFixed(1)}%`
                : `+${value}`;
            
            return (
                <div key={key} className="stat-item">
                    <span className="stat-name">{statName}</span>
                    <span className="stat-value">{formattedValue}</span>
                </div>
            );
        });
    };

    const renderGearSlot = (slot: GearSlot) => {
        const equippedItem = character.getEquippedItem(slot);
        return (
            <div className="gear-slot" key={slot}>
                {/* <div className="slot-name">{GEAR_SLOT_NAMES[slot]}</div> */}
                <div className={`slot-content ${equippedItem ? 'equipped' : 'empty'}`}>
                    {equippedItem ? (
                        <div className="item-info">
                            <Tooltip title="装备等级：1" placement="top">
                                <div className="item-name">
                                    <span>{equippedItem.name}</span>
                                    <span className="item-level">Lv.1</span>
                                </div>
                            </Tooltip>
                            <div className="item-stats">
                                {renderGearStats(equippedItem.stats)}
                            </div>
                            <Button 
                                size="small" 
                                onClick={() => character.unequipItem(slot)}
                                className="unequip-btn"
                            >
                                卸下
                            </Button>
                        </div>
                    ) : (
                        <div className="empty-slot">
                            <span>未装备{GEAR_SLOT_NAMES[slot]}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const items = [
        {
            key: '1',
            label: '基础属性',
            children: (
                <div className="base-stats">
                    <div className="level-info">
                        <p>等级: {character.level}</p>
                        <div className="exp-progress">
                            <Progress
                                percent={expPercentage}
                                size="small"
                                format={() => `${character.exp}/${character.expNeeded}`}
                            />
                        </div>
                    </div>
                    <p>
                        <span>攻击力</span>
                        <span>{character.attack}</span>
                    </p>
                    <p>
                        <span>防御力</span>
                        <span>{character.defense}</span>
                    </p>
                    <p>
                        <span>暴击率</span>
                        <span>{(character.critRate * 100).toFixed(1)}%</span>
                    </p>
                    <p>
                        <span>暴击伤害</span>
                        <span>{(character.critDamage * 100).toFixed(1)}%</span>
                    </p>
                    <p>
                        <span>充能效率</span>
                        <span>{(character.chargeRate * 100).toFixed(1)}%</span>
                    </p>
                </div>
            ),
        },
        {
            key: '2',
            label: '装备',
            children: (
                <div className="gear-panel">
                    {Object.values(GearSlot).map(slot => renderGearSlot(slot))}
                </div>
            ),
        },
    ];

    return (
        <div className="character-base-status">
            <Button 
                onClick={() => setIsModalVisible(true)}
                className="status-button"
            >
                角色状态
            </Button>

            <Modal
                title={`${character.name} - 角色详情`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Tabs items={items} />
            </Modal>
        </div>
    );
};

export default CharacterBaseStatus; 