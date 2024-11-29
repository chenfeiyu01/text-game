import React from 'react';
import BattleStatus from '../BattleStatus';
import { BattleSystem } from '../../class/battle-system';
// import './index.scss';
import MessageDisplay from '../MessageDisplay';
import { Character } from '../../class/human';
import { SKILL_LIST } from '../../constants/skill-list';
import { Button } from 'antd';

import PLAYER from '../../data/character/player';
import { PIGLET_CONFIG } from '../../data/character/monsters/piglet';

const BattleScene: React.FC = () => {
    const [player, setPlayer] = React.useState<Character | null>(null);
    const [enemy, setEnemy] = React.useState<Character | null>(null);

    /**
     * 战斗演示函数
     * 创建角色、敌人并进行一场战斗
     */
    const battleDemo = async () => {
        // 创建玩家角色
        const newPlayer = PLAYER;
        newPlayer.equipSkill(SKILL_LIST[0]);

        // 创建敌人角色
        const newEnemy = new Character(PIGLET_CONFIG);

        setPlayer(newPlayer);
        setEnemy(newEnemy);

        // 初始化战斗UI界面
        // const battleUI = new BattleUI('battle-container');

        // 创建并配置战斗系统
        const battle = new BattleSystem(
            newPlayer,
            newEnemy,
            // 战斗日志回调函数 - 更新UI显示
            (log) => {
                // battleUI.addBattleLog(log);
                // battleUI.updateStatus(newPlayer, newEnemy);
            }
        );

        // 开始战斗并等待结果
        const result = await battle.startBattle();

        // 在控制台输出战斗总结
        console.log(battle.getBattleSummary());
    };

    return (
        <div className="battle-container">
            <Button onClick={battleDemo}>开始战斗</Button>
            {player && enemy && (
                <BattleStatus player={player} enemy={enemy} />
            )}
            <MessageDisplay />
        </div>
    );
};

export default BattleScene; 