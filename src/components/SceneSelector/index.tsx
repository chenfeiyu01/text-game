import React from 'react';
import { Card, List, Tag, Tooltip, Modal } from 'antd';
import { SCENES } from '../../data/maps/scenes';
import { Player } from '../../class/player';
import { QuestSystem } from '../../class/quest-system';
import { QuestObjectiveType } from '../../constants/quest';
import './index.scss';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ESCENES } from '../../constants/scenes';

interface SceneSelectorProps {
    visible: boolean;
    onClose: () => void;
    onSceneSelect: (sceneId: string) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({ 
    visible, 
    onClose, 
    onSceneSelect 
}) => {
    const player = Player.getInstance();
    const playerLevel = player.level;
    const questSystem = QuestSystem.getInstance();

    const handleSelect = (sceneId: string) => {
        onSceneSelect(sceneId);
        onClose();
    };

    // 检查场景是否有相关任务
    const getSceneQuestInfo = (sceneId: string) => {
        // 获取所有进行中的任务
        const inProgressQuests = questSystem.getInProgressQuests();
        
        // 找出所��匹配当前副本的任务
        const matchedQuests = inProgressQuests.filter(quest => 
            // 检查任务目标中的副本
            quest.objectives.some(obj => 
                obj.type === QuestObjectiveType.COMPLETE_DUNGEON && 
                obj.target === sceneId
            ) ||
            // 检查任务的匹配副本列表
            quest.matchScenes?.includes(sceneId as ESCENES)
        );

        if (matchedQuests.length > 0) {
            return (
                <Tag color="blue" className="quest-tag">
                    相关任务 ({matchedQuests.length})
                    <Tooltip 
                        title={
                            <div>
                                {matchedQuests.map(quest => (
                                    <div key={quest.id}>• {quest.title}</div>
                                ))}
                            </div>
                        }
                    >
                        <InfoCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                </Tag>
            );
        }
        return null;
    };

    return (
        <Modal
            title="选择副本"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            destroyOnClose
        >
            <div className="scene-selector">
                <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={Object.values(SCENES)}
                    renderItem={scene => {
                        const isLevelMatch = playerLevel >= scene.levelRange.min && 
                                           playerLevel <= scene.levelRange.max;
                        
                        return (
                            <List.Item>
                                <Card 
                                    title={
                                        <div className="scene-title">
                                            <div className="scene-title-left">
                                                <span>{scene.name}</span>
                                                <Tag color={isLevelMatch ? 'green' : 'orange'}>
                                                    推荐 Lv.{scene.levelRange.min}-{scene.levelRange.max}
                                                </Tag>
                                                {!isLevelMatch && playerLevel < scene.levelRange.min && (
                                                    <Tag color="red">难度较大</Tag>
                                                )}
                                                {!isLevelMatch && playerLevel > scene.levelRange.max && (
                                                    <Tag color="gray">难度较低</Tag>
                                                )}
                                                {getSceneQuestInfo(scene.id)}
                                            </div>
                                        </div>
                                    }
                                    className={`scene-card ${isLevelMatch ? 'available' : 'locked'}`}
                                    hoverable
                                    onClick={() => {
                                        if (!isLevelMatch && playerLevel < scene.levelRange.min) {
                                            Modal.confirm({
                                                title: '难度警告',
                                                content: `该副本推荐等级为 ${scene.levelRange.min}-${scene.levelRange.max}，你的等级较低，可能会遇到较大挑战。是否继续？`,
                                                onOk: () => handleSelect(scene.id)
                                            });
                                        } else {
                                            handleSelect(scene.id);
                                        }
                                    }}
                                >
                                    <div className="scene-content">
                                        <p className="scene-description">{scene.description}</p>
                                        <div className="scene-info">
                                            <div className="rewards">
                                                <Tooltip title="经验值范围">
                                                    <div>
                                                        经验: {scene.baseRewards.exp} - {scene.baseRewards.exp * scene.rules?.minBattles}
                                                    </div>
                                                </Tooltip>
                                                <Tooltip title="金币范围">
                                                    <div>
                                                        金币: {scene.baseRewards.gold} - {scene.baseRewards.gold * scene.rules?.minBattles}
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            {!isLevelMatch && (
                                                <div className="level-warning">
                                                    需要等级: {scene.levelRange.min}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </List.Item>
                        );
                    }}
                />
            </div>
        </Modal>
    );
}; 