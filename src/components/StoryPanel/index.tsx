import React from 'react';
import { Modal, List, Badge, Typography, Empty } from 'antd';
import { StorySystem, StoryEntry } from '../../class/story-system';
import { BookOutlined } from '@ant-design/icons';
import './index.scss';

const { Title, Paragraph } = Typography;

interface StoryPanelProps {
    visible: boolean;
    onClose: () => void;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({ visible, onClose }) => {
    const storySystem = StorySystem.getInstance();
    const entries = storySystem.getEntries();

    const handleEntryClick = (entry: StoryEntry) => {
        if (!entry.isRead) {
            storySystem.markAsRead(entry.id);
        }
    };

    return (
        <Modal
            title="剧情日志"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            className="story-panel"
        >
            {entries.length > 0 ? (
                <List
                    className="story-list"
                    itemLayout="vertical"
                    dataSource={entries}
                    renderItem={entry => (
                        <List.Item
                            onClick={() => handleEntryClick(entry)}
                            className={`story-entry ${entry.isRead ? 'read' : 'unread'}`}
                        >
                            <div className="entry-header">
                                <Title level={4}>
                                    <BookOutlined /> {entry.title}
                                    {!entry.isRead && <Badge status="processing" />}
                                </Title>
                            </div>
                            <div className="entry-content">
                                {entry.content}
                            </div>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="暂无剧情记录" />
            )}
        </Modal>
    );
}; 