import React, { useState, useEffect } from 'react';
import { Character } from '../../class/character';
import { Progress } from 'antd';
import './index.scss';
import PLAYER from '../../data/character/player';

interface CharacterBaseStatusProps {
    character: Character;
}

const CharacterBaseStatus: React.FC<CharacterBaseStatusProps> = ({ character }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    useEffect(() => {
        const cleanup = character.setStateChangeCallback(() => {
            setUpdateTrigger(prev => prev + 1);
        });

        // 使用返回的清理函数
        return cleanup;
    }, [character]);

    // 计算经验值百分比
    const expPercentage = Math.floor((character.exp / character.expNeeded) * 100);

    return (
        <div className="character-base-status">
            <h3>{character.name}</h3>
            <p>攻击力: {character.attack}</p>
            <p>防御力: {character.defense}</p>
            <p>暴击率: {(character.critRate * 100).toFixed(1)}%</p>
            <p>暴击伤害: {(character.critDamage * 100).toFixed(1)}%</p>
            <p>充能效率: {(character.chargeRate * 100).toFixed(1)}%</p>
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
        </div>
    );
};

export default CharacterBaseStatus; 