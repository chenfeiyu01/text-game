import { Button } from 'antd'
import './App.css'
import BattleScene from './components/BattleScene'
import CharacterBaseStatus from './components/CharacterBaseStatus'
import PLAYER from './data/character/player'
import { SCENES } from './data/maps/scenes'
import { SaveSystem } from './class/save-system'
import player from './data/character/player'

/**
 * App组件 - 游戏主界面
 * 包含战斗演示功能
 */
function App() {
  // 计数器状态(未使用)


  // 组件挂载时启动战斗演示
  /* useEffect(() => {
    battleDemo();
  }, []) */

  // 渲染战斗容器
  return (
    <>
      <CharacterBaseStatus character={PLAYER} />
      <BattleScene sceneConfig={SCENES.LUOLAN} />

      <div>
        <Button onClick={() => {
          const saveSystem = SaveSystem.getInstance();
          saveSystem.saveGame(player);
        }}>保存状态</Button>
        <Button onClick={() => {
          const saveSystem = SaveSystem.getInstance();
          saveSystem.loadGame();
        }}>恢复状态</Button>
      </div>
    </>
  )
}

export default App
