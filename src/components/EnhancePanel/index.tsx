import React from 'react';
import { EnhanceNpc } from '../../class/npc';
import './index.scss';

interface EnhancePanelProps {
    npc: EnhanceNpc;
}

export const EnhancePanel: React.FC<EnhancePanelProps> = ({ npc }) => {
    return (
        <div className="enhance-panel">
            <h3>装备强化</h3>
            {/* TODO: 实现强化界面 */}
        </div>
    );
}; 