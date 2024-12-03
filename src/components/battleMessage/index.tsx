import { GameMessage } from "../../constants/game-system";
import './index.scss';

const BattleMessage: React.FC<{ msg: GameMessage }> = ({ msg }) => {
    const { data: battleLog, content } = msg;

    // 如果没有战斗日志数据，返回普通消息
    if (!battleLog) {
        return <div className="message-normal">{content}</div>;
    }

    // 构建消息样式和内容
    let messageClass = 'message-normal';
    let roundContent = null;
debugger
    // 判断消息类型优先级：击败 > 暴击 > 技能 > 普通
    if (battleLog.isDefeated) {
        messageClass = 'message-defeat';
    } else if (battleLog.isCrit) {
        messageClass = 'message-crit';
    } else if (battleLog.action.includes('使用技能')) {
        messageClass = 'message-skill';
    }

    // 如果有回合信息，添加回合显示
    if (battleLog.round) {
        roundContent = <div className="round">回合 {battleLog.round}</div>;
    }

    return (
        <div>
            {/* {roundContent} */}
            <div className={messageClass}>{content}</div>
        </div>
    );
}

export default BattleMessage;