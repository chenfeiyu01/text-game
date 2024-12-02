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

function App() {
  const [gameState, setGameState] = useState<'start' | 'creation' | 'game'>('start');

  const handleStartNewGame = () => {
    setGameState('creation');
  };

  const handleLoadGame = () => {
    const saveSystem = SaveSystem.getInstance();
    if (saveSystem.loadGame()) {
      setGameState('game');
    }
  };

  const handleCreateCharacter = (player: Player) => {
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
        <>
          <CharacterBaseStatus character={Player.getInstance()} />
          <BattleScene sceneConfig={SCENES.LUOLAN} />
          <div>
            <Button onClick={() => {
              const saveSystem = SaveSystem.getInstance();
              saveSystem.saveGame(Player.getInstance());
            }}>保存状态</Button>
          </div>
        </>
      );
  }
}

export default App;
