import React from 'react';
import { Button, Space } from 'antd';
import { SaveSystem } from '../../class/save-system';
import './index.scss';

interface StartScreenProps {
    onStartNewGame: () => void;
    onLoadGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartNewGame, onLoadGame }) => {
    const saveSystem = SaveSystem.getInstance();
    const hasSaveData = saveSystem.hasSaveData();

    return (
        <div className="start-screen">
            <h1>陈泡泡大冒险</h1>
            <Space direction="vertical" size="large">
                <Button type="primary" size="large" onClick={onStartNewGame}>
                    新的冒险
                </Button>
                <Button 
                    size="large" 
                    onClick={onLoadGame}
                    disabled={!hasSaveData}
                >
                    继续冒险
                </Button>
            </Space>
        </div>
    );
};

export default StartScreen; 