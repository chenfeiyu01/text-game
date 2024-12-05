import React, { useState } from 'react';
import { Tabs, List, Tag, Progress, Button, Modal, Tooltip, message } from 'antd';
import { QuestStatus, QuestType, QuestConfig, QuestDialog } from '../../constants/quest';
import { Player } from '../../class/player';
import { QuestSystem } from '../../class/quest-system';
import './index.scss';
import { getItemById } from '../../utils/items';
import { getRarityColor, getRarityTagColor, isGearItem } from '../../constants/item';
import { formatStatValue, STAT_CONFIG, StatType } from '../../constants/stats';
import { ItemTooltip } from '../ItemTooltip';
import { ItemTag } from '../ItemTag';
import { NpcDialog } from '../NpcDialog';
import { NPC_FUNCTION_NAMES } from '../../constants/npc';

const { TabPane } = Tabs;

interface QuestPanelProps {
    visible: boolean;
    onClose: () => void;
}

export const QuestPanel: React.FC<QuestPanelProps> = ({ visible, onClose }) => {
    const [selectedQuest, setSelectedQuest] = useState<QuestConfig | null>(null);
    const questSystem = QuestSystem.getInstance();
    const player = Player.getInstance();
    const [currentDialog, setCurrentDialog] = useState<{
        dialogs: QuestDialog[];
        onComplete: () => void;
    } | null>(null);

    const getQuestTypeTag = (type: QuestType) => {
        const colors = {
            [QuestType.MAIN]: 'red',
            [QuestType.SIDE]: 'blue',
            [QuestType.DAILY]: 'green',
            [QuestType.ACHIEVEMENT]: 'purple'
        };
        const labels = {
            [QuestType.MAIN]: '主线',
            [QuestType.SIDE]: '支线',
            [QuestType.DAILY]: '日常',
            [QuestType.ACHIEVEMENT]: '成就'
        };
        return <Tag color={colors[type]}>{labels[type]}</Tag>;
    };

    const renderObjectiveProgress = (quest: QuestConfig) => {
        return quest.objectives.map((obj, index) => (
            <div key={index} className="objective-item">
                <div className="objective-desc">{obj.description}</div>
                <Progress
                    percent={Math.floor((obj.current / obj.required) * 100)}
                    size="small"
                    format={() => `${obj.current}/${obj.required}`}
                />
            </div>
        ));
    };

    const renderQuestRewards = (quest: QuestConfig) => {
        return (
            <div className="quest-rewards">
                {quest.reward.exp && (
                    <div className="reward-item">
                        <span className="reward-icon">✨</span>
                        <span>经验值: {quest.reward.exp}</span>
                    </div>
                )}
                {quest.reward.gold && (
                    <div className="reward-item">
                        <span className="reward-icon">💰</span>
                        <span>金币: {quest.reward.gold}</span>
                    </div>
                )}
                {quest.reward.items?.map((itemReward, index) => {
                    const item = getItemById(itemReward.id);
                    if (!item) return null;
                    return (
                        <ItemTooltip
                            key={index}
                            item={item}
                            quantity={itemReward.quantity}
                        >
                            <div className="reward-item">
                                <span className="reward-icon">🎁</span>
                                <ItemTag item={item} />
                                {itemReward.quantity && <span className="reward-quantity">x{itemReward.quantity}</span>}
                            </div>
                        </ItemTooltip>
                    );
                })}
            </div>
        );
    };

    const handleQuestAction = async (quest: QuestConfig) => {
        const status = questSystem.getQuestStatus(quest.id);

        switch (status) {
            case QuestStatus.AVAILABLE:
                // 显示开始对话
                setCurrentDialog({
                    dialogs: quest.dialogs.start,
                    onComplete: () => {
                        questSystem.acceptQuest(quest.id);
                        message.success(`接受任务：${quest.title}`);
                        setSelectedQuest(null);
                        setCurrentDialog(null);
                    }
                });
                break;

            case QuestStatus.COMPLETE:
                // 显示完成对话
                setCurrentDialog({
                    dialogs: quest.dialogs.complete,
                    onComplete: () => {
                        questSystem.completeQuest(quest.id);
                        message.success(`完成任务：${quest.title}`);
                        setSelectedQuest(null);
                        setCurrentDialog(null);
                    }
                });
                break;
        }
    };

    const getActionButton = (quest: QuestConfig) => {
        const status = questSystem.getQuestStatus(quest.id);
        switch (status) {
            case QuestStatus.AVAILABLE:
                return (
                    <Button
                        type="primary"
                        onClick={() => handleQuestAction(quest)}
                    >
                        接受任务
                    </Button>
                );
            case QuestStatus.IN_PROGRESS:
                return <Button disabled>进行中</Button>;
            case QuestStatus.COMPLETE:
                return (
                    <Button
                        type="primary"
                        onClick={() => handleQuestAction(quest)}
                    >
                        提交任务
                    </Button>
                );
            case QuestStatus.FINISHED:
                return <Button disabled>已完成</Button>;
            default:
                return (
                    <Button disabled>
                        {quest.level > player.level ? `需要等级 ${quest.level}` : '无法接取'}
                    </Button>
                );
        }
    };

    return (
        <>
            <Modal
                title="任务面板"
                open={visible && !currentDialog}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <Tabs defaultActiveKey="available">
                    <TabPane tab="可接任务" key="available">
                        <List
                            dataSource={questSystem.getAvailableQuests()}
                            renderItem={quest => (
                                <List.Item
                                    actions={[getActionButton(quest)]}
                                    onClick={() => setSelectedQuest(quest)}
                                >
                                    <List.Item.Meta
                                        title={
                                            <div className="quest-title">
                                                {getQuestTypeTag(quest.type)}
                                                <span>{quest.title}</span>
                                                <span className="quest-level">
                                                    建议等级: {quest.level}
                                                </span>
                                            </div>
                                        }
                                        description={quest.description}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>
                    <TabPane tab="进行中" key="inProgress">
                        <List
                            dataSource={questSystem.getInProgressQuests()}
                            renderItem={quest => (
                                <List.Item
                                    actions={[getActionButton(quest)]}
                                    onClick={() => setSelectedQuest(quest)}
                                >
                                    <List.Item.Meta
                                        title={quest.title}
                                        description={
                                            <div>
                                                {renderObjectiveProgress(quest)}
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>
                    <TabPane tab="已完成" key="completed">
                        <List
                            dataSource={questSystem.getCompletedQuests()}
                            renderItem={quest => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={quest.title}
                                        description={quest.description}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>
                </Tabs>

                {selectedQuest && (
                    <Modal
                        title={selectedQuest.title}
                        open={!!selectedQuest}
                        onCancel={() => setSelectedQuest(null)}
                        footer={[
                            <Button key="close" onClick={() => setSelectedQuest(null)}>
                                关闭
                            </Button>,
                            // getActionButton(selectedQuest)
                        ]}
                    >
                        <div className="quest-detail">
                            <div className="quest-desc">{selectedQuest.description}</div>
                            <div className="quest-objectives">
                                <h4>任务目标</h4>
                                {renderObjectiveProgress(selectedQuest)}
                            </div>
                            <div className="quest-rewards">
                                <h4>任务奖励</h4>
                                {renderQuestRewards(selectedQuest)}
                            </div>
                        </div>
                    </Modal>
                )}
            </Modal>

            {/* 任务对话框 */}
            {currentDialog && (
                <Modal
                    title="对话"
                    open={true}
                    footer={null}
                    onCancel={() => setCurrentDialog(null)}
                >
                    <div className="quest-dialog">
                        {currentDialog.dialogs.map((dialog, index) => (
                            <div key={index} className="dialog-content">
                                <div className="npc-name">{`${NPC_FUNCTION_NAMES[dialog.npcId]}：`}</div>
                                <div className="dialog-text">{dialog.text}</div>
                                {dialog.options?.map((option, optIndex) => (
                                    <Button
                                        key={optIndex}
                                        onClick={() => {
                                            if (!option.next) {
                                                currentDialog.onComplete();
                                            }
                                            // TODO: 处理对话选项链
                                        }}
                                    >
                                        {option.text}
                                    </Button>
                                ))}
                            </div>
                        ))}
                        {!currentDialog.dialogs[currentDialog.dialogs.length - 1].options && (
                            <Button type="primary" onClick={currentDialog.onComplete}>
                                继续
                            </Button>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}; 