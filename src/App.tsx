import React, { useState } from 'react'
import './App.css'
import BattleScene from './components/BattleScene'
import CharacterBaseStatus from './components/CharacterBaseStatus'
import StartScreen from './components/StartScreen'
import CharacterCreation from './components/CharacterCreation'
import { Player } from './class/player'
import { SCENES } from './data/maps/scenes'
import { SaveSystem } from './class/save-system'
import { Button, Space } from 'antd'
import Inventory from './components/Inventory'
import { Character } from './class/character'
import { InboxOutlined, CompassOutlined, ShopOutlined, ThunderboltOutlined, BookOutlined, SaveOutlined } from '@ant-design/icons'
import { NpcDialog } from './components/NpcDialog'
import { ShopNpc, EnhanceNpc, SkillTrainerNpc } from './class/npc'
import { ESCENES } from './constants/scenes'
import { SceneSelector } from './components/SceneSelector'
import { DevTools } from './components/DevTools'


function App() {
  const [gameState, setGameState] = useState<'start' | 'creation' | 'game'>('start');
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);
  const [isNpcDialogVisible, setIsNpcDialogVisible] = useState(false);
  const [isEnhanceDialogVisible, setIsEnhanceDialogVisible] = useState(false);
  const [isSkillTrainerDialogVisible, setIsSkillTrainerDialogVisible] = useState(false);
  const [selectedScene, setSelectedScene] = useState<string>(ESCENES.MAPLE_FOREST);
  const [isInBattle, setIsInBattle] = useState(false);
  const [isSceneSelectorVisible, setIsSceneSelectorVisible] = useState(false);

  // 使用静态工厂方法创建NPC
  const shopkeeper = ShopNpc.create('SHOP_KEEPER');
  const blacksmith = EnhanceNpc.create('BLACKSMITH');
  const skillMaster = SkillTrainerNpc.create('SKILL_MASTER');

  const handleStartNewGame = () => {
    setGameState('creation');
  };

  const handleLoadGame = () => {
    const saveSystem = SaveSystem.getInstance();
    if (saveSystem.loadGame()) {
      setGameState('game');
    }
  };

  const handleCreateCharacter = (character: Character) => {
    setGameState('game');
  };

  const handleSceneSelect = (sceneId: string) => {
    setSelectedScene(sceneId);
    setIsInBattle(true);
  };

  const renderGameUI = () => (
    <div className="game-layout">
      <div className="game-header">
        <div className="header-left">
          <h1>冒险者日志</h1>
        </div>
        <div className="header-right">
          <Space>
            <Button 
              icon={<SaveOutlined />}
              onClick={() => {
                const saveSystem = SaveSystem.getInstance();
                saveSystem.saveGame(Player.getInstance());
              }}
            >
              保存游戏
            </Button>
          </Space>
        </div>
      </div>
      
      <div className="game-main">
        <div className="game-sider">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button block icon={<InboxOutlined />} onClick={() => setIsInventoryVisible(true)}>
              背包
            </Button>
            <Button block icon={<ShopOutlined />} onClick={() => setIsNpcDialogVisible(true)}>
              商店
            </Button>
            <Button block icon={<ThunderboltOutlined />} onClick={() => setIsEnhanceDialogVisible(true)}>
              强化
            </Button>
            <Button block icon={<BookOutlined />} onClick={() => setIsSkillTrainerDialogVisible(true)}>
              技能
            </Button>
            <Button block icon={<CompassOutlined />} onClick={() => setIsSceneSelectorVisible(true)}>
              选择副本
            </Button>
          </Space>
        </div>

        <div className="game-content">
          <CharacterBaseStatus character={Player.getInstance()} />
          
          {isInBattle ? (
            <div className="battle-container">
              <Button className="back-button" onClick={() => setIsInBattle(false)}>
                返回主界面
              </Button>
              <BattleScene sceneConfig={SCENES[selectedScene]} />
            </div>
          ) : (
            <div className="welcome-content">
              <h2>欢迎回来，冒险者！</h2>
              <p>选择一个副本开始你的冒险吧！</p>
            </div>
          )}
        </div>
      </div>

      {/* 弹窗组件 */}
      <NpcDialog npc={shopkeeper} visible={isNpcDialogVisible} onClose={() => setIsNpcDialogVisible(false)} />
      <NpcDialog npc={blacksmith} visible={isEnhanceDialogVisible} onClose={() => setIsEnhanceDialogVisible(false)} />
      <NpcDialog npc={skillMaster} visible={isSkillTrainerDialogVisible} onClose={() => setIsSkillTrainerDialogVisible(false)} />
      <Inventory visible={isInventoryVisible} onClose={() => setIsInventoryVisible(false)} />
      <SceneSelector visible={isSceneSelectorVisible} onClose={() => setIsSceneSelectorVisible(false)} onSceneSelect={handleSceneSelect} />
      
      {/* 添加开发者工具 */}
      {process.env.NODE_ENV === 'development' && <DevTools />}
    </div>
  );

  switch (gameState) {
    case 'start':
      return (
        <StartScreen
          onStartNewGame={handleStartNewGame}
          onLoadGame={handleLoadGame}
        />
      );

    case 'creation':
      return (
        <CharacterCreation
          onCreateCharacter={handleCreateCharacter}
          onBack={() => setGameState('start')}
        />
      );

    case 'game':
      return renderGameUI();
  }
}

export default App;
