import React from 'react';
import BattleStatus from '../BattleStatus';
import { BattleSystem } from '../../class/battle-system';
import MessageDisplay from '../MessageDisplay';
import { Character } from '../../class/human';
import { SKILL_LIST } from '../../constants/skill-list';
import { Button } from 'antd';
import PLAYER from '../../data/character/player';
import { BattleResult } from '../../constants/battle';
import MONSTERS from '../../data/character/monsters';
import { Scene } from '../../constants/scenes';


interface BattleSceneProps {
    sceneConfig: Scene;
    onBattleEnd?: (victory: boolean) => void;
}

const BattleScene: React.FC<BattleSceneProps> = ({ sceneConfig, onBattleEnd }) => {
    const [player, setPlayer] = React.useState<Character | null>(null);
    const [enemy, setEnemy] = React.useState<Character | null>(null);
    const [currentEnemyIndex, setCurrentEnemyIndex] = React.useState(0);
    const [isFirstBattle, setIsFirstBattle] = React.useState(true);

    const startBattle = async () => {
        let currentPlayer: Character;
        let currentEnemy: Character;

        if (isFirstBattle) {
            // 首次战斗，初始化玩家和第一个敌人
            currentPlayer = PLAYER;
            currentPlayer.equipSkill(SKILL_LIST[0]);
            currentEnemy = sceneConfig.battles[0].monster;
            setIsFirstBattle(false);
        } else {
            // 继续战斗，保持玩家当前状态，创建新敌人
            currentPlayer = player!;
            currentEnemy = sceneConfig.battles[currentEnemyIndex].monster;
        }

        setPlayer(currentPlayer);
        setEnemy(currentEnemy);

        const battle = new BattleSystem(
            currentPlayer,
            currentEnemy,
            (log) => {
                // 处理战斗日志
            }
        );

        const result = await battle.startBattle();

        if (result === BattleResult.VICTORY) {
            if (currentEnemyIndex < sceneConfig.battles.length - 1) {
                // 还有下一个敌人
                setCurrentEnemyIndex(prev => prev + 1);
            } else {
                // 场景完成
                onBattleEnd?.(true);
            }
        } else {
            // 战斗失败
            onBattleEnd?.(false);
        }
    };

    return (
        <div
            className="battle-container"
        >
            <div className="scene-info">
                <h2>{sceneConfig.name}</h2>
                <p>当前敌人: {currentEnemyIndex + 1}/{sceneConfig.battles.length + 1}</p>
            </div>

            <Button onClick={startBattle}>
                {currentEnemyIndex === 0
                    ? '开始战斗'
                    : `继续战斗 (剩余${sceneConfig.battles.length - currentEnemyIndex}个敌人, 下一个: ${sceneConfig.battles[currentEnemyIndex].monster.name})`}
            </Button>

            {player && enemy && (
                <BattleStatus player={player} enemy={enemy} />
            )}
            <MessageDisplay />
        </div>
    );
};

export default BattleScene; 