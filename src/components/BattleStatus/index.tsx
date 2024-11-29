import React, { useState, useEffect } from 'react';
import { Character } from '../../class/human';
import './index.scss';

interface BattleStatusProps {
    player: Character;
    enemy: Character;
}

const CharacterStatus: React.FC<{ character: Character }> = ({ character }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    useEffect(() => {
        character.setStateChangeCallback(() => {
            setUpdateTrigger(prev => prev + 1);
        });

        return () => {
            character.setStateChangeCallback(() => {});
        };
    }, [character]);

    return (
        <div className="character-status">
            <h3>{character.name}</h3>
            <p>HP: {character.hp}/{character.maxHp}</p>
            <p>MP: {character.mp}/{character.maxMp}</p>
            <p>充能: {character.charge.toFixed(1)}%</p>
            <p>攻击力: {character.attack}</p>
            <p>防御力: {character.defense}</p>
            <p>暴击率: {(character.critRate * 100).toFixed(1)}%</p>
            <p>暴击伤害: {(character.critDamage * 100).toFixed(1)}%</p>
            <p>充能效率: {(character.chargeRate * 100).toFixed(1)}%</p>
            <p>装备技能: {character.equippedSkill?.name || '无'}</p>
        </div>
    );
};

const BattleStatus: React.FC<BattleStatusProps> = ({ player, enemy }) => {
    return (
        <div className="battle-status">
            <CharacterStatus character={player} />
            <CharacterStatus character={enemy} />
        </div>
    );
};

export default BattleStatus;
