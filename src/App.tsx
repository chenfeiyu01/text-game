import React, { useState } from 'react'
import './App.scss'
import BattleScene from './components/BattleScene'
import CharacterBaseStatus from './components/CharacterBaseStatus'
import StartScreen from './components/StartScreen'
import CharacterCreation from './components/CharacterCreation'
import { Player } from './class/player'
import { SCENES } from './data/maps/scenes'
import { SaveSystem } from './class/save-system'
import { Button, Space, Badge } from 'antd'
import Inventory from './components/Inventory'
import { Character } from './class/character'
import { InboxOutlined, CompassOutlined, ShopOutlined, ThunderboltOutlined, BookOutlined, SaveOutlined } from '@ant-design/icons'
import { NpcDialog } from './components/NpcDialog'
import { ShopNpc, EnhanceNpc, SkillTrainerNpc } from './class/npc'
import { ESCENES } from './constants/scenes'
import { SceneSelector } from './components/SceneSelector'
import { DevTools } from './components/DevTools'
import { QuestPanel } from './components/QuestPanel'
import { StoryPanel } from './components/StoryPanel'
import { StorySystem } from './class/story-system'
import { QuestSystem } from './class/quest-system'


function App() {
  const [gameState, setGameState] = useState<'start' | 'creation' | 'game'>('start');
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);
  const [isNpcDialogVisible, setIsNpcDialogVisible] = useState(false);
  const [isEnhanceDialogVisible, setIsEnhanceDialogVisible] = useState(false);
  const [isSkillTrainerDialogVisible, setIsSkillTrainerDialogVisible] = useState(false);
  const [selectedScene, setSelectedScene] = useState<string>(ESCENES.MAPLE_FOREST);
  const [isInBattle, setIsInBattle] = useState(false);
  const [isSceneSelectorVisible, setIsSceneSelectorVisible] = useState(false);
  const [isQuestPanelVisible, setIsQuestPanelVisible] = useState(false);
  const [isStoryPanelVisible, setIsStoryPanelVisible] = useState(false);

  // 使用静态工厂方法创建NPC
  const shopkeeper = ShopNpc.create('SHOP_KEEPER');
  const blacksmith = EnhanceNpc.create('BLACKSMITH');
  const skillMaster = SkillTrainerNpc.create('SKILL_MASTER');

  // 只在游戏状态为 'game' 时获取这些值
  const getGameData = () => {
    if (gameState !== 'game') return { unreadCount: 0, availableQuestsCount: 0 };
    
    const storySystem = StorySystem.getInstance();
    const questSystem = QuestSystem.getInstance();
    
    return {
      unreadCount: storySystem.getUnreadCount(),
      availableQuestsCount: questSystem.getAvailableQuests().length
    };
  };

  const { unreadCount, availableQuestsCount } = getGameData();

  const handleStartNewGame = () => {
    setGameState('creation');
  };

  const handleLoadGame = () => {
    if (SaveSystem.load()) {
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
                SaveSystem.save();
              }}
            >
              保存游戏
            </Button>
          </Space>
        </div>
      </div>

      <div className="game-main">
        <div className="game-sider">
          <Space direction="horizontal" size="middle">
            <Button
              icon={<InboxOutlined />}
              onClick={() => setIsInventoryVisible(true)}
            >
              背包
            </Button>
            <Button
              icon={<ShopOutlined />}
              onClick={() => setIsNpcDialogVisible(true)}
            >
              商店
            </Button>
            <Button
              icon={<ThunderboltOutlined />}
              onClick={() => setIsEnhanceDialogVisible(true)}
            >
              强化
            </Button>
            <Button
              icon={<BookOutlined />}
              onClick={() => setIsSkillTrainerDialogVisible(true)}
            >
              技能
            </Button>
            <Button
              icon={<CompassOutlined />}
              onClick={() => setIsSceneSelectorVisible(true)}
            >
              副本
            </Button>
            <Button
              icon={<BookOutlined />}
              onClick={() => setIsQuestPanelVisible(true)}
            >
              <Badge count={availableQuestsCount} offset={[5, 0]} size="small">
                任务
              </Badge>
            </Button>
            <Button
              icon={<BookOutlined />}
              onClick={() => setIsStoryPanelVisible(true)}
            >
              <Badge count={unreadCount} offset={[5, 0]} size="small">
                剧情日志
              </Badge>
            </Button>
            <Button type="text">
              <CharacterBaseStatus character={Player.getInstance()} />
            </Button>
            {/* <CharacterBaseStatus character={Player.getInstance()} /> */}
          </Space>
        </div>

        <div className="game-content">

          {isInBattle ? (
            <div className="battle-wrapper">
              <BattleScene sceneConfig={SCENES[selectedScene]} onBattleEnd={() => setIsInBattle(false)} />
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
      <QuestPanel
        visible={isQuestPanelVisible}
        onClose={() => setIsQuestPanelVisible(false)}
      />
      <StoryPanel
        visible={isStoryPanelVisible}
        onClose={() => setIsStoryPanelVisible(false)}
      />

      {/* 添加开发者��具 */}
      {/* @ts-ignore */}
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
