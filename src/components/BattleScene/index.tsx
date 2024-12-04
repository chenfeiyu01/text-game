import React from 'react';
import BattleStatus from '../BattleStatus';
import { BattleSystem } from '../../class/battle-system';
import MessageDisplay from '../MessageDisplay';
import { Character } from '../../class/character';
import { SKILL_LIST } from '../../constants/skill-list';
import { Button } from 'antd';
import { Player } from '../../class/player';
import { BattleResult, BattleReward } from '../../constants/battle';
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
    const [isBossBattle, setIsBossBattle] = React.useState(false);

    const startBattle = async (enemy: Character) => {
        let currentPlayer: Character;
        let currentEnemy: Character;
        let battleReward: BattleReward;

        if (isFirstBattle) {
            // 首次战斗，初始化玩家和第一个敌人
            currentPlayer = Player.getInstance();
            currentPlayer.equipSkill(SKILL_LIST[0]);
            currentEnemy = sceneConfig.battles[0].monster;
            battleReward = sceneConfig.battles[0].reward;
            setIsFirstBattle(false);
        } else {
            // 继续战斗，保持玩家当前状态，创建新敌人
            currentPlayer = player!;
            if (currentEnemyIndex >= sceneConfig.battles.length) {
                currentEnemy = sceneConfig.boss.monster;
                battleReward = sceneConfig.boss.reward;
                setIsBossBattle(true);
            } else {
                currentEnemy = sceneConfig.battles[currentEnemyIndex].monster;
                battleReward = sceneConfig.battles[currentEnemyIndex].reward;
            }
        }

        setPlayer(currentPlayer);
        setEnemy(currentEnemy);

        const battle = new BattleSystem(
            currentPlayer,
            currentEnemy,
            (log) => {
                // 处理战斗日志
            },
            battleReward,
            sceneConfig.id
        );

        const result = await battle.startBattle();

        if (result === BattleResult.VICTORY) {
            if (!isBossBattle && currentEnemyIndex < sceneConfig.battles.length) {
                setCurrentEnemyIndex(prev => prev + 1);
            } else if (isBossBattle) {
                onBattleEnd?.(true);
            }
        } else {
            onBattleEnd?.(false);
        }
    };

    const getBattleButtonText = () => {
        if (currentEnemyIndex === 0) return '开始战斗';
        if (currentEnemyIndex >= sceneConfig.battles.length) return `挑战Boss: ${sceneConfig.boss.monster.name}`;
        return `继续战斗 (剩余${sceneConfig.battles.length - currentEnemyIndex}个敌人, 下一个: ${sceneConfig.battles[currentEnemyIndex].monster.name})`;
    };

    return (
        <div className="battle-container">
            <div className="scene-info">
                <h2>{sceneConfig.name}</h2>
                <p>当前进度: {isBossBattle ? 'Boss战' : `${currentEnemyIndex + 1}/${sceneConfig.battles.length + 1}`}</p>
            </div>

            <Button onClick={() => startBattle(enemy!)}>
                {getBattleButtonText()}
            </Button>

            {player && enemy && (
                <BattleStatus player={player} enemy={enemy} />
            )}
            <MessageDisplay />
        </div>
    );
};

export default BattleScene; 