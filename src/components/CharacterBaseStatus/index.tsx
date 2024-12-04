import React, { useState, useEffect } from 'react';
import { Character } from '../../class/character';
import { Progress, Modal, Button, Tabs, Tooltip } from 'antd';
import { GearSlot, GearItem, getRarityColor } from '../../constants/item';
import { StatType, STAT_CONFIG, formatStatValue } from '../../constants/stats';
import './index.scss';

interface CharacterBaseStatusProps {
    character: Character;
}

/**
 * 装备槽位显示名称
 */
const GEAR_SLOT_NAMES: Record<GearSlot, string> = {
    [GearSlot.WEAPON]: '武器',
    [GearSlot.ARMOR]: '护甲',
    [GearSlot.ACCESSORY]: '饰品'
} as const;

const getCharacterStatValue = (character: Character, propertyName: string): number => {
    const value = character[propertyName as keyof Character];
    return typeof value === 'number' ? value : 0;
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

    // 渲染装备属性
    const renderGearStats = (stats: GearItem['stats']) => {
        return Object.entries(stats).map(([key, value]) => {
            if (!value) return null;
            const statType = key as StatType;
            
            return (
                <div key={key} className="stat-item">
                    <span className="stat-name">{STAT_CONFIG[statType].name}</span>
                    <span className="stat-value">+{formatStatValue(statType, value)}</span>
                </div>
            );
        });
    };


    // FIXME: 这里基础属性面板的显示需要修复，显示错误了
    // 渲染基础属性面板
    const renderBaseStats = () => {
        const statsToShow = [
            StatType.ATTACK,
            StatType.DEFENSE,
            StatType.CRIT_RATE,
            StatType.CRIT_DAMAGE,
            StatType.CHARGE_RATE
        ];

        return statsToShow.map(statType => {
            const propertyName = statType.toLowerCase();
            return (
                <p key={statType}>
                    <span>{STAT_CONFIG[statType].name}</span>
                    <span>{formatStatValue(statType, getCharacterStatValue(character, propertyName))}</span>
                </p>
            );
        });
    };

    const renderGearSlot = (slot: GearSlot) => {
        const equippedItem = character.getEquippedItem(slot);
        return (
            <div className="gear-slot" key={slot}>
                <div className={`slot-content ${equippedItem ? 'equipped' : 'empty'}`}>
                    {equippedItem ? (
                        <div className="item-info">
                            <Tooltip title={`装备等级：${equippedItem.enhanceLevel || 0}`} placement="top">
                                <div className="item-name">
                                    <span style={{ color: getRarityColor(equippedItem.rarity) }}>
                                        {equippedItem.name}
                                    </span>
                                    <span className="item-level">+{equippedItem.enhanceLevel || 0}</span>
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

    const renderSkillSlot = () => {
        const equippedSkill = character.equippedSkill;
        return (
            <div className="gear-slot skill-slot">
                <div className={`slot-content ${equippedSkill ? 'equipped' : 'empty'}`}>
                    {equippedSkill ? (
                        <div className="item-info">
                            <div className="item-name">
                                <span>{equippedSkill.name}</span>
                            </div>
                            <div className="item-stats">
                                <div className="stat-item">
                                    <span>魔法消耗</span>
                                    <span>{equippedSkill.manaCost}</span>
                                </div>
                                <div className="stat-item">
                                    <span>充能消耗</span>
                                    <span>{equippedSkill.chargeCost}%</span>
                                </div>
                            </div>
                            <Button 
                                size="small" 
                                onClick={() => character.equipSkill(undefined)}
                                className="unequip-btn"
                            >
                                卸下
                            </Button>
                        </div>
                    ) : (
                        <div className="empty-slot">
                            <span>未装备技能</span>
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
                                percent={Math.floor((character.exp / character.expNeeded) * 100)}
                                size="small"
                                format={() => `${character.exp}/${character.expNeeded}`}
                            />
                        </div>
                    </div>
                    {renderBaseStats()}
                </div>
            ),
        },
        {
            key: '2',
            label: '装备',
            children: (
                <div className="gear-panel">
                    {Object.values(GearSlot).map(slot => renderGearSlot(slot))}
                    {renderSkillSlot()}
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