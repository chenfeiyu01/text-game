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

function App() {
  const [gameState, setGameState] = useState<'start' | 'creation' | 'game'>('start');
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);

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
