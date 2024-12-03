import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { EnhanceNpc, Npc, ShopNpc, SkillTrainerNpc } from '../../class/npc';
import { NpcFunction } from '../../constants/npc';
import { ShopPanel } from '../ShopPanel';
import { EnhancePanel } from '../EnhancePanel';
import { SkillPanel } from '../SkillPanel';
import './index.scss';

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
    // 根据 NPC 的第一个功能直接显示对应面板
    const currentPanel = npc.functions[0];

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
                    <p className='dialog-text'>{dialog.text}</p>
                    <div className="dialog-options">
                        {/* {dialog.options?.map((option, index) => (
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
                        ))} */}
                    </div>
                </div>
                <div className="function-panel">
                    {renderFunctionPanel()}
                </div>
            </div>
        </Modal>
    );
};
