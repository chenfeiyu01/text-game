import React, { useState } from 'react';
import { SkillTrainerNpc } from '../../class/npc';
import { Player } from '../../class/player';
import { Button, List, message, Tooltip, Space } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import './index.scss';
import { Skill } from '../../constants/skill-list';

interface SkillPanelProps {
    npc: SkillTrainerNpc;
}

export const SkillPanel: React.FC<SkillPanelProps> = ({ npc }) => {
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const player = Player.getInstance();
    const availableSkills = npc.getAvailableSkills();

    const handleLearnSkill = (skillId: string) => {
        const skill = availableSkills.find(s => s.id === skillId);
        if (!skill) return;


        if (player.skills.has(skillId)) {
            message.error('已学习该技能');
            return;
        }

        if (player.level < skill.requiredLevel) {
            message.error(`等级不足，需要等级 ${skill.requiredLevel}`);
            return;
        }

        if (!player.inventory.removeGold(skill.cost)) {
            message.error(`金币不足，需要 ${skill.cost} 金币`);
            return;
        }


        if (npc.teachSkill(player, skillId)) {
            message.success(`成功学习技能：${skill.name}`);
            setSelectedSkillId(null);
            setUpdateTrigger(prev => prev + 1);
        } else {
            player.inventory.addGold(skill.cost);
            message.error('学习失败');
        }
    };

    const getDisabledReason = (skill: Skill): string | null => {
        if (player.skills.has(skill.id)) {
            return '已学习';
        }
        if (player.level < skill.requiredLevel) {
            return `需要等级：${skill.requiredLevel}`;
        }
        if (player.inventory.getGold() < skill.cost) {
            return `需要金币：${skill.cost}`;
        }
        return null;
    };

    const handleEquipSkill = (skill: Skill, e: React.MouseEvent) => {
        e.stopPropagation();
        const player = Player.getInstance();
        player.equipSkill(skill);
        message.success(`成功装备技能：${skill.name}`);
        setUpdateTrigger(prev => prev + 1);
    };

    return (
        <div className="skill-panel">
            <List
                itemLayout="horizontal"
                dataSource={availableSkills}
                renderItem={skill => (
                    <List.Item
                        className={`skill-item ${selectedSkillId === skill.id ? 'selected' : ''} 
                                  ${player.skills.has(skill.id) ? 'learned' : ''}`}
                        onClick={() => setSelectedSkillId(skill.id)}
                    >
                        <List.Item.Meta
                            title={
                                <div className="skill-header">
                                    <span className="skill-name">
                                        {skill.name}
                                        {player.equippedSkill?.id === skill.id && 
                                            <span className="equipped-tag">（已装备）</span>
                                        }
                                    </span>
                                    <span className="skill-cost">{skill.cost} 金币</span>
                                </div>
                            }
                            description={
                                <div className="skill-info">
                                    <div className="skill-description">{skill.description}</div>
                                    <div className="skill-requirements">
                                        <span>需求等级: {skill.requiredLevel}</span>
                                        <span>魔法消耗: {skill.manaCost}</span>
                                        <span>充能消耗: {skill.chargeCost}%</span>
                                    </div>
                                </div>
                            }
                        />
                        <Space>
                            {player.skills.has(skill.id) ? (
                                <Button
                                    type="primary"
                                    icon={<ToolOutlined />}
                                    className='equip-skill-button'
                                    disabled={player.equippedSkill?.id === skill.id}
                                    onClick={(e) => handleEquipSkill(skill, e)}
                                >
                                    {player.equippedSkill?.id === skill.id ? '已装备' : '装备'}
                                </Button>
                            ) : (
                                <Tooltip
                                    title={getDisabledReason(skill)}
                                    placement="top"
                                    open={getDisabledReason(skill) ? undefined : false}
                                >
                                    <Button
                                        type="primary"
                                        className='learn-skill-button'
                                        disabled={
                                            player.skills.has(skill.id) ||
                                            player.level < skill.requiredLevel ||
                                            player.inventory.getGold() < skill.cost
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLearnSkill(skill.id);
                                        }}
                                    >
                                        学习
                                    </Button>
                                </Tooltip>
                            )}
                        </Space>
                    </List.Item>
                )}
            />
        </div>
    );
}; 