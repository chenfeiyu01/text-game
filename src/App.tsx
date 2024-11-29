import { useEffect, useState } from 'react'
import './App.css'
import { Character } from './class/human'
import { SKILL_LIST } from './constants/skill-list'
import { BattleUI } from './class/battle-ui'
import { BattleSystem } from './class/battle-system'
import MessageDisplay from './components/MessageDisplay'

/**
 * App组件 - 游戏主界面
 * 包含战斗演示功能
 */
function App() {
  // 计数器状态(未使用)

  /**
   * 战斗演示函数
   * 创建角色、敌人并进行一场战斗
   */
  const battleDemo = async () => {
    // 创建玩家角色 - 勇者
    const player = new Character(
      '勇者',
      100,    // maxHp
      100,    // maxMp
      15,     // attack
      8,      // defense
      0.2,    // critRate
      2.0,    // critDamage
      3.0    // chargeRate
    );

    // 为玩家装备火球术技能
    player.equipSkill(SKILL_LIST[0]); 

    // 创建敌人角色 - 哥布林
    const enemy = new Character(
      '哥布林',
      80,     // maxHp
      50,     // maxMp
      12,     // attack
      5       // defense
    );

    // 初始化战斗UI界面
    const battleUI = new BattleUI('battle-container');

    // 创建并配置战斗系统
    const battle = new BattleSystem(
      player,
      enemy,
      // 战斗日志回调函数 - 更新UI显示
      (log) => {
        battleUI.addBattleLog(log);
        battleUI.updateStatus(player, enemy);
      }
    );

    // 开始战斗并等待结果
    const result = await battle.startBattle();

    // 在控制台输出战斗总结
    console.log(battle.getBattleSummary());
  };

  // 组件挂载时启动战斗演示
  useEffect(() => {
    battleDemo();
  }, [])

  // 渲染战斗容器
  return (
    <>
      <div id="battle-container" className="battle-container">

      </div>
      <MessageDisplay />
    </>
  )
}

export default App
