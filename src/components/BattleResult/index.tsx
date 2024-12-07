import React from 'react';
import { Card, Button } from 'antd';
import { BattleReward } from '../../constants/battle';

interface BattleResultProps {
    result: {
        victory: boolean;
        rewards?: BattleReward;
    };
    onClose: () => void;
}

const BattleResult: React.FC<BattleResultProps> = ({ result, onClose }) => {
    return (
        <Card className="battle-result">
            <div className={`result-title ${result.victory ? 'victory' : 'defeat'}`}>
                {result.victory ? '战斗胜利！' : '战斗失败'}
            </div>
            {result.rewards && (
                <div className="rewards">
                    <h3>获得奖励：</h3>
                    <div className="reward-list">
                        <div>经验值: +{result.rewards.exp}</div>
                        <div>金币: +{result.rewards.gold}</div>
                    </div>
                </div>
            )}
            <Button type="primary" size="large" onClick={onClose}>
                继续
            </Button>
        </Card>
    );
};

export default BattleResult; 