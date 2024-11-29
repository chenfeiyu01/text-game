import { useEffect, useState } from 'react'
import './App.css'
import { Character } from './class/human'
import { SKILL_LIST } from './constants/skill-list'
import { BattleUI } from './class/battle-ui'
import { BattleSystem } from './class/battle-system'
import MessageDisplay from './components/MessageDisplay'
import BattleStatus from './components/BattleStatus'
import BattleScene from './components/BattleScene'

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
      <BattleScene />
    </>
  )
}

export default App
