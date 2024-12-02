import { Npc } from './npc';
import { NpcFunction } from '../constants/npc';

export class NpcManager {
    private static instance: NpcManager;
    private npcs: Map<string, Npc> = new Map();

    private constructor() {}

    static getInstance(): NpcManager {
        if (!NpcManager.instance) {
            NpcManager.instance = new NpcManager();
        }
        return NpcManager.instance;
    }

    registerNpc(npc: Npc) {
        this.npcs.set(npc.id, npc);
    }

    getNpc(id: string): Npc | undefined {
        return this.npcs.get(id);
    }

    getNpcsByFunction(func: NpcFunction): Npc[] {
        return Array.from(this.npcs.values())
            .filter(npc => npc.hasFunction(func));
    }
} 