import React from 'react';
import { Card, List, Tag, Tooltip, Modal } from 'antd';
import { SCENES } from '../../data/maps/scenes';
import { Player } from '../../class/player';
import './index.scss';

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

    const handleSelect = (sceneId: string) => {
        onSceneSelect(sceneId);
        onClose();
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
                                            <span>{scene.name}</span>
                                            <Tag color={isLevelMatch ? 'green' : 'red'}>
                                                Lv.{scene.levelRange.min}-{scene.levelRange.max}
                                            </Tag>
                                        </div>
                                    }
                                    className={`scene-card ${isLevelMatch ? 'available' : 'locked'}`}
                                    hoverable
                                    onClick={() => isLevelMatch && handleSelect(scene.id)}
                                >
                                    <div className="scene-content">
                                        <p className="scene-description">{scene.description}</p>
                                        <div className="scene-info">
                                            <div className="rewards">
                                                <Tooltip title="经验值范围">
                                                    <div>
                                                        经验: {scene.battles[0].reward.exp} - {scene.boss.reward.exp}
                                                    </div>
                                                </Tooltip>
                                                <Tooltip title="金币范围">
                                                    <div>
                                                        金币: {scene.battles[0].reward.gold} - {scene.boss.reward.gold}
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