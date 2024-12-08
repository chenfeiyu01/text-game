import React, { useState, useEffect } from 'react';
import { Character } from '../../class/character';
import { Progress, Modal, Button, Tabs, Tooltip, } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons'
import { GearSlot, GearItem, getRarityColor } from '../../constants/item';
import { StatType, STAT_CONFIG, formatStatValue } from '../../constants/stats';
import './index.scss';
import { SkillEffect, SkillEffectType } from '../../constants/skill-list';
import { ItemTag } from '../ItemTag';

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
    return character.getStat(propertyName as StatType);
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
            StatType.MAX_HP,
            StatType.MAX_MP,
            StatType.ATTACK,
            StatType.DEFENSE,
            StatType.CRIT_RATE,
            StatType.CRIT_DAMAGE,
            StatType.CHARGE_RATE,
            StatType.BONUS_DAMAGE,
            StatType.SPELL_AFFINITY,
            StatType.DAMAGE_REDUCTION,
            StatType.MAGIC_RESISTANCE,
        ];

        return statsToShow.map(statType => {
            const baseValue = character.getBaseStat(statType);
            const bonusValue = character.getBonusStat(statType);
            const totalValue = baseValue + bonusValue;

            return (
                <div className="stat-item" key={statType}>
                    <Tooltip title={STAT_CONFIG[statType].description}>
                        <span className="stat-name">{STAT_CONFIG[statType].name}</span>
                    </Tooltip>
                    <span className="stat-value">
                        <span>{formatStatValue(statType, totalValue)}</span>
                        {bonusValue !== 0 && (
                            <span className="stat-breakdown">
                                ({formatStatValue(statType, baseValue)} + 
                                <span className={bonusValue > 0 ? 'positive' : 'negative'}>
                                    {formatStatValue(statType, bonusValue)}
                                </span>)
                            </span>
                        )}
                    </span>
                </div>
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
                                    <span>
                                        <ItemTag item={equippedItem} />
                                    </span>
                                    {/* <span className="item-level">+{equippedItem.enhanceLevel || 0}</span> */}
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
                            <div className="skill-description">
                                {equippedSkill.description}
                            </div>
                            <div className="item-stats">
                                <div className="stat-item">
                                    <span>伤害类型</span>
                                    <span>{equippedSkill.damageType === 'physical' ? '物理' : '魔法'}</span>
                                </div>
                                <div className="stat-item">
                                    <span>基础伤害</span>
                                    <span>{equippedSkill.damage}</span>
                                </div>
                                <div className="stat-item">
                                    <span>魔法消耗</span>
                                    <span>{equippedSkill.manaCost}</span>
                                </div>
                                <div className="stat-item">
                                    <span>充能消耗</span>
                                    <span>{equippedSkill.chargeCost}%</span>
                                </div>
                                {equippedSkill.hitCount && (
                                    <div className="stat-item">
                                        <span>攻击次数</span>
                                        <span>{equippedSkill.hitCount}</span>
                                    </div>
                                )}
                                {equippedSkill.effects?.map((effect, index) => (
                                    <div key={index} className="effect-item">
                                        {renderSkillEffect(effect)}
                                    </div>
                                ))}
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

    const renderSkillEffect = (effect: SkillEffect) => {
        switch (effect.type) {
            case SkillEffectType.STUN:
                return `${effect.chance ? effect.chance * 100 : 0}%几率眩晕${effect.duration}回合`;
            case SkillEffectType.BUFF:
                return `提升${STAT_CONFIG[effect.stat!].name} ${effect.value! * 100}% (${effect.duration}回合)`;
            case SkillEffectType.DEBUFF:
                return `降低${STAT_CONFIG[effect.stat!].name} ${Math.abs(effect.value!) * 100}% (${effect.duration}回合)`;
            case SkillEffectType.HEAL:
                return `恢复${effect.value! * 100}%最大生命值`;
            case SkillEffectType.GUARANTEED_CRIT:
                return `必定暴击，无视目标${effect.defenseReduction! * 100}%防御`;
            default:
                return '';
        }
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
                icon={<InfoCircleOutlined />}
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