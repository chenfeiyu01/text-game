import React, { useState, useEffect } from 'react';
import BattleStatus from '../BattleStatus';
import { BattleSystem } from '../../class/battle-system';
import MessageDisplay from '../MessageDisplay';
import { Character } from '../../class/character';
import { Button } from 'antd';
import { Player } from '../../class/player';
import { BattleReward, EBattleResult } from '../../constants/battle';
import { Scene } from '../../constants/scenes';
import { DungeonGenerator } from '../../class/dungeon-generator';

import './index.scss';
import { DungeonNode } from '../../constants/dungeon';
import { EventPanel } from '../EventPanel';
import BattleResult from '../BattleResult';


interface BattleSceneProps {
    sceneConfig: Scene;
    onBattleEnd: () => void;
}

export const BattleScene: React.FC<BattleSceneProps> = ({ sceneConfig, onBattleEnd }) => {
    const [currentNode, setCurrentNode] = useState<DungeonNode | null>(null);
    const [dungeon, setDungeon] = useState<DungeonNode | null>(null);
    const [player, setPlayer] = useState<Character | null>(null);
    const [battleResult, setBattleResult] = useState<{
        victory: boolean;
        rewards?: BattleReward;
    } | null>(null);

    // 初始化副本
    useEffect(() => {
        const generator = DungeonGenerator.getInstance();
        const generatedDungeon = generator.generateDungeon(sceneConfig);
        setDungeon(generatedDungeon);
        setCurrentNode(generatedDungeon);
        setPlayer(Player.getInstance());
    }, [sceneConfig]);

    const handleNodeComplete = async () => {
        setBattleResult(null);  // 清除战斗结果
        
        if (!currentNode?.next.length) {
            // 副本完成
            onBattleEnd();
            return;
        }
        
        // 进入下一个节点
        const nextNode = currentNode.next[0];
        setCurrentNode(nextNode);

        // 如果是战斗节点，初始化新的敌人
        if (nextNode.type === 'BATTLE' || nextNode.type === 'BOSS') {
            // setPlayer(Player.getInstance());
            // setEnemy(nextNode.content.monster!);
        }
    };

    const renderCurrentNode = () => {
        if (!currentNode || !player) return null;

        switch (currentNode.type) {
            case 'BATTLE':
            case 'BOSS':
                return (
                    <div className="battle-controls">
                        <BattleStatus player={player} enemy={currentNode.content.monster!} />
                        <Button
                            type="primary"
                            onClick={() => startBattle(currentNode.content.monster!)}
                        >
                            {currentNode.type === 'BOSS' ? '开始Boss战斗' : '开始战斗'}
                        </Button>
                    </div>
                );

            case 'EVENT':
                return (
                    <EventPanel
                        event={currentNode.content.event!}
                        onComplete={handleNodeComplete}
                    />
                );
        }
    };

    const startBattle = async (enemy: Character) => {
        const battle = new BattleSystem(
            player!,
            enemy,
            undefined,
            {
                exp: sceneConfig.baseRewards.exp,
                gold: sceneConfig.baseRewards.gold
            },
            sceneConfig.id
        );

        const result = await battle.startBattle();

        if (result === EBattleResult.VICTORY) {
            setBattleResult({
                victory: true,
                rewards: {
                    exp: sceneConfig.baseRewards.exp,
                    gold: sceneConfig.baseRewards.gold,
                    items: sceneConfig.baseRewards.items?.map(item => item.id)
                }
            });
        } else {
            setBattleResult({
                victory: false
            });
        }
    };

    const getProgressText = () => {
        if (!currentNode) return '';

        const totalNodes = dungeon ? countNodes(dungeon) : 1;
        let completedNodes = 1;
        let node = dungeon;
        while (node && node !== currentNode) {
            completedNodes++;
            node = node.next[0];
        }

        return `${completedNodes}/${totalNodes}`;
    };

    const countNodes = (node: DungeonNode): number => {
        return 1 + node.next.reduce((sum, n) => sum + countNodes(n), 0);
    };

    return (
        <div className="battle-container">
            <Button className="back-button" onClick={onBattleEnd}>
                返回城镇
            </Button>

            <div className="scene-info">
                <h2>{sceneConfig.name}</h2>
                <p>进度: {getProgressText()}</p>
            </div>

            {battleResult ? (
                <BattleResult result={battleResult} onClose={handleNodeComplete} />
            ) : (
                renderCurrentNode()
            )}

            <MessageDisplay />
        </div>
    );
};

export default BattleScene; 