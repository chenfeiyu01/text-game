import { useState } from 'react'
import './App.css'
import BattleScene from './components/BattleScene'
import CharacterBaseStatus from './components/CharacterBaseStatus'
import StartScreen from './components/StartScreen'
import CharacterCreation from './components/CharacterCreation'
import { Player } from './class/player'
import { SCENES } from './data/maps/scenes'
import { SaveSystem } from './class/save-system'
import { Button } from 'antd'
import Inventory from './components/Inventory'
import { Character } from './class/character'
import { InboxOutlined } from '@ant-design/icons'
import { NpcDialog } from './components/NpcDialog'
import { ShopNpc, EnhanceNpc, SkillTrainerNpc } from './class/npc'

function App() {
  const [gameState, setGameState] = useState<'start' | 'creation' | 'game'>('start');
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);
  const [isNpcDialogVisible, setIsNpcDialogVisible] = useState(false);
  const [isEnhanceDialogVisible, setIsEnhanceDialogVisible] = useState(false);
  const [isSkillTrainerDialogVisible, setIsSkillTrainerDialogVisible] = useState(false);

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
      return (
        <div className="game-container">
          <CharacterBaseStatus character={Player.getInstance()} />
          <Button
            onClick={() => setIsInventoryVisible(true)}
            icon={<InboxOutlined />}
          >
            背包
          </Button>
          <Button
            onClick={() => setIsNpcDialogVisible(true)}
            icon={<InboxOutlined />}
          >
            商店
          </Button>
          <Button
            onClick={() => setIsEnhanceDialogVisible(true)}
            icon={<InboxOutlined />}
          >
            强化
          </Button>
          <Button
            onClick={() => setIsSkillTrainerDialogVisible(true)}
            icon={<InboxOutlined />}
          >
            技能
          </Button>


          <NpcDialog
            npc={shopkeeper}
            visible={isNpcDialogVisible}
            onClose={() => setIsNpcDialogVisible(false)}
          />
          <NpcDialog
            npc={blacksmith}
            visible={isEnhanceDialogVisible}
            onClose={() => setIsEnhanceDialogVisible(false)}
          />
          <NpcDialog
            npc={skillMaster}
            visible={isSkillTrainerDialogVisible}
            onClose={() => setIsSkillTrainerDialogVisible(false)}
          />
          <Inventory
            visible={isInventoryVisible}
            onClose={() => setIsInventoryVisible(false)}
          />
          <BattleScene sceneConfig={SCENES.LUOLAN} />
          <Button onClick={() => {
            const saveSystem = SaveSystem.getInstance();
            saveSystem.saveGame(Player.getInstance());
          }}>保存状态</Button>
        </div>
      );
  }
}

export default App;
