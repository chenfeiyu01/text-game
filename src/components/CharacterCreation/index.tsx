import React, { useState } from 'react';
import { Button, Input, Card, Descriptions, Space } from 'antd';
import { Character } from '../../class/character';
import { Player } from '../../class/player';
import './index.scss';

interface CharacterCreationProps {
    onCreateCharacter: (character: Character) => void;
    onBack: () => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreateCharacter, onBack }) => {
    const [name, setName] = useState('');
    const [attributes, setAttributes] = useState(generateRandomAttributes());

    function generateRandomAttributes() {
        return {
            maxHp: Math.floor(Math.random() * 30) + 90, // 90-120
            maxMp: Math.floor(Math.random() * 20) + 90, // 90-110
            attack: Math.floor(Math.random() * 6) + 12,  // 12-18
            defense: Math.floor(Math.random() * 4) + 6,  // 6-10
            critRate: Number((Math.random() * 0.1 + 0.15).toFixed(2)), // 0.15-0.25
            critDamage: Number((Math.random() * 0.3 + 1.4).toFixed(2)), // 1.4-1.7
            chargeRate: Number((Math.random() * 0.5 + 1.0).toFixed(2))  // 1.0-1.5
        };
    }

    const handleReroll = () => {
        setAttributes(generateRandomAttributes());
    };

    const handleCreate = () => {
        if (!name.trim()) {
            return;
        }

        const player = Player.initializePlayer({
            name: name.trim(),
            ...attributes
        });

        onCreateCharacter(player);
    };

    return (
        <div className="character-creation">
            <Card title="创建你的角色" className="creation-card">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Input
                        placeholder="输入角色名称"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        maxLength={12}
                    />

                    <Descriptions title="角色属性" column={1} bordered>
                        <Descriptions.Item label="生命值">
                            {attributes.maxHp}
                        </Descriptions.Item>
                        <Descriptions.Item label="魔法值">
                            {attributes.maxMp}
                        </Descriptions.Item>
                        <Descriptions.Item label="攻击力">
                            {attributes.attack}
                        </Descriptions.Item>
                        <Descriptions.Item label="防御力">
                            {attributes.defense}
                        </Descriptions.Item>
                        <Descriptions.Item label="暴击率">
                            {(attributes.critRate * 100).toFixed(1)}%
                        </Descriptions.Item>
                        <Descriptions.Item label="暴击伤害">
                            {(attributes.critDamage * 100).toFixed(1)}%
                        </Descriptions.Item>
                        <Descriptions.Item label="充能效率">
                            {(attributes.chargeRate * 100).toFixed(1)}%
                        </Descriptions.Item>
                    </Descriptions>

                    <Space>
                        <Button onClick={handleReroll}>重新随机</Button>
                        <Button 
                            type="primary"
                            onClick={handleCreate}
                            disabled={!name.trim()}
                        >
                            开始冒险
                        </Button>
                        <Button onClick={onBack}>返回</Button>
                    </Space>
                </Space>
            </Card>
        </div>
    );
};

export default CharacterCreation; 