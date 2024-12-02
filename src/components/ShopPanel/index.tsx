import React from 'react';
import { ShopNpc } from '../../class/npc';
import './index.scss';

interface ShopPanelProps {
    npc: ShopNpc;
}

export const ShopPanel: React.FC<ShopPanelProps> = ({ npc }) => {
    return (
        <div className="shop-panel">
            <h3>商店</h3>
            {/* TODO: 实现商店界面 */}
        </div>
    );
}; 