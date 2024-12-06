import React, { useState } from 'react';
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
import { QuestSystem } from '../../class/quest-system';

import './index.scss';


interface BattleSceneProps {
    sceneConfig: Scene;
    onBattleEnd: () => void;
}

const BattleScene: React.FC<BattleSceneProps> = ({ sceneConfig, onBattleEnd }) => {
    const [player, setPlayer] = React.useState<Character | null>(null);
    const [enemy, setEnemy] = React.useState<Character | null>(null);
    const [currentEnemyIndex, setCurrentEnemyIndex] = React.useState(0);
    const [isFirstBattle, setIsFirstBattle] = React.useState(true);
    const [isBossBattle, setIsBossBattle] = React.useState(false);
    const [battleResult, setBattleResult] = useState<{
        victory: boolean;
        rewards?: BattleReward;
    } | null>(null);

    const startBattle = async (enemy: Character) => {
        let currentPlayer: Character;
        let currentEnemy: Character;
        let battleReward: BattleReward;

        if (isFirstBattle) {
            // 首次战斗，初始化玩家和第一个敌人
            currentPlayer = Player.getInstance();
            currentEnemy = new Character(sceneConfig.battles[0].monster);
            battleReward = sceneConfig.battles[0].reward;
            setIsFirstBattle(false);
        } else {
            // 继续战斗，保持玩家当前状态，创建新敌人
            currentPlayer = player!;
            if (currentEnemyIndex >= sceneConfig.battles.length) {
                // Boss战
                currentEnemy = new Character(sceneConfig.boss.monster);
                battleReward = sceneConfig.boss.reward;
                setIsBossBattle(true);
            } else {
                // 普通战斗
                currentEnemy = new Character(sceneConfig.battles[currentEnemyIndex].monster);
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
            if (isBossBattle) {
                // Boss战胜利
                QuestSystem.getInstance().onSceneComplete(sceneConfig.id);
                setBattleResult({
                    victory: true,
                    rewards: sceneConfig.boss.reward
                });
            } else if (currentEnemyIndex + 1 >= sceneConfig.battles.length) {
                // 击败最后一个普通怪物，进入Boss战
                setCurrentEnemyIndex(prev => prev + 1);
                setIsBossBattle(true);
            } else {
                // 继续下一场普通战斗
                setCurrentEnemyIndex(prev => prev + 1);
            }
        } else {
            // 战斗失败
            setBattleResult({
                victory: false
            });
        }
    };

    const getBattleButtonText = () => {
        if (currentEnemyIndex === 0) return '开始战斗';
        if (currentEnemyIndex >= sceneConfig.battles.length) return `挑战Boss: ${sceneConfig.boss.monster.name}`;
        return `继续战斗 (剩余${sceneConfig.battles.length - currentEnemyIndex}个敌人, 下一个: ${sceneConfig.battles[currentEnemyIndex].monster.name})`;
    };



    return (
        <div className="battle-container">
            <Button className="back-button" onClick={onBattleEnd}>
                返回城镇
            </Button>

            <div className="scene-info">
                <h2>{sceneConfig.name}</h2>
                <p>当前进度: {isBossBattle ? 'Boss战' : `${currentEnemyIndex + 1}/${sceneConfig.battles.length + 1}`}</p>
            </div>

            {battleResult ? (
                <div className="battle-result">
                    <div className={`result-title ${battleResult.victory ? 'victory' : 'defeat'}`}>
                        {battleResult.victory ? '战斗胜利！' : '战斗失败'}
                    </div>
                    {battleResult.rewards && (
                        <div className="rewards">
                            <h3>获得奖励：</h3>
                            <div className="reward-list">
                                <div>经验值: +{battleResult.rewards.exp}</div>
                                <div>金币: +{battleResult.rewards.gold}</div>
                            </div>
                        </div>
                    )}
                    <Button type="primary" size="large" onClick={onBattleEnd}>
                        返回
                    </Button>
                </div>
            ) : (
                <>
                    <div className="battle-controls">
                        <Button type="primary" size="large" onClick={() => startBattle(enemy!)}>
                            {getBattleButtonText()}
                        </Button>
                    </div>

                    {player && enemy && (
                        <div className="battle-status">
                            <BattleStatus player={player} enemy={enemy} />
                        </div>
                    )}
                </>
            )}
            <MessageDisplay />
        </div>
    );
};

export default BattleScene; 