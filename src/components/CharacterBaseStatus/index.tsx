import React, { useState, useEffect } from 'react';
import { Character } from '../../class/character';
import './index.scss';

interface CharacterBaseStatusProps {
    character: Character;
}

const CharacterBaseStatus: React.FC<CharacterBaseStatusProps> = ({ character }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    useEffect(() => {
        character.setStateChangeCallback(() => {
            setUpdateTrigger(prev => prev + 1);
        });

        return () => {
            character.setStateChangeCallback(() => { });
        };
    }, [character]);

    return (
        <div className="character-base-status">
            <h3>{character.name}</h3>
            <p>攻击力: {character.attack}</p>
            <p>防御力: {character.defense}</p>
            <p>暴击率: {(character.critRate * 100).toFixed(1)}%</p>
            <p>暴击伤害: {(character.critDamage * 100).toFixed(1)}%</p>
            <p>充能效率: {(character.chargeRate * 100).toFixed(1)}%</p>
            <p>经验值: {character.exp}/{character.expNeeded}</p>
            <p>当前等级: {character.level}</p>
        </div>
    );
};

export default CharacterBaseStatus; 