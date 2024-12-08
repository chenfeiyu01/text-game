import React, { useState, useEffect } from 'react';
import { Character } from '../../class/character';
import './index.scss';
import { StatType } from '../../constants/stats';

interface BattleStatusProps {
    player: Character;
    enemy: Character;
}

const CharacterStatus: React.FC<{ character: Character }> = ({ character }) => {
    const [updateTrigger, setUpdateTrigger] = useState(0);

    useEffect(() => {
        const cleanup = character.setStateChangeCallback(() => {
            setUpdateTrigger(prev => prev + 1);
        });
        return cleanup;
    }, [character]);

    return (
        <div className="character-status">
            <h3>{character.name}</h3>
            <p>HP: {character.hp}/{character.getStat(StatType.MAX_HP)}</p>
            <p>MP: {character.mp}/{character.getStat(StatType.MAX_MP)}</p>
            <p>攻击力: {character.getStat(StatType.ATTACK)}</p>
            <p>防御力: {character.getStat(StatType.DEFENSE)}</p>
            <p>暴击率: {character.getStat(StatType.CRIT_RATE)}%</p>
            <p>暴击伤害: {character.getStat(StatType.CRIT_DAMAGE)}%</p>
            <p>充能: {character.charge.toFixed(1)}%</p>
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
