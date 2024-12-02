import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { EnhanceNpc, Npc, ShopNpc, SkillTrainerNpc } from '../../class/npc';
import { NpcFunction } from '../../constants/npc';
import { ShopPanel } from '../ShopPanel';
import { EnhancePanel } from '../EnhancePanel';
import { SkillPanel } from '../SkillPanel';

interface NpcDialogProps {
    npc: Npc;
    visible: boolean;
    onClose: () => void;
}

export const NpcDialog: React.FC<NpcDialogProps> = ({
    npc,
    visible,
    onClose
}) => {

    console.log('npc issisiis  ', npc);
    const [currentPanel, setCurrentPanel] = useState<NpcFunction | null>(null);

    const renderFunctionPanel = () => {
        switch (currentPanel) {
            case NpcFunction.SHOP:
                return <ShopPanel npc={npc as ShopNpc} />;
            case NpcFunction.ENHANCE:
                return <EnhancePanel npc={npc as EnhanceNpc} />;
            case NpcFunction.SKILL:
                return <SkillPanel npc={npc as SkillTrainerNpc} />;
            default:
                return null;
        }
    };

    const dialog = npc.getCurrentDialog();

    return (
        <Modal
            title={npc.name}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <div className="npc-dialog">
                <div className="dialog-content">
                    <p>{dialog.text}</p>
                    <div className="dialog-options">
                        {dialog.options?.map((option, index) => (
                            <Button
                                key={index}
                                onClick={() => {
                                    if (option.nextDialogId) {
                                        npc.setDialog(option.nextDialogId);
                                    }
                                    if (option.action) {
                                        option.action();
                                    }
                                }}
                            >
                                {option.text}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="function-buttons">
                    {npc.functions.map(func => (
                        <Button
                            key={func}
                            onClick={() => setCurrentPanel(func)}
                        >
                            {getFunctionName(func)}
                        </Button>
                    ))}
                </div>
                {currentPanel && (
                    <div className="function-panel">
                        {renderFunctionPanel()}
                    </div>
                )}
            </div>
        </Modal>
    );
};

function getFunctionName(func: NpcFunction): string {
    switch (func) {
        case NpcFunction.SHOP: return '商店';
        case NpcFunction.ENHANCE: return '强化';
        case NpcFunction.SKILL: return '学习技能';
        case NpcFunction.QUEST: return '任务';
        case NpcFunction.STORAGE: return '仓库';
        default: return '';
    }
} 