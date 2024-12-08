import { Character } from './character';
import { Buff, BuffSourceType, BuffType } from '../constants/buff';
import { StatType } from '../constants/stats';

/** Buff管理器 */
export class BuffManager {
    private buffs: Map<string, Buff> = new Map();
    private target: Character;

    constructor(target: Character) {
        this.target = target;
    }

    /** 添加buff */
    addBuff(buff: Buff): void {
        // 如果已存在同类型buff，先移除旧的
        if (buff.stat) {
            this.removeBuffsByStat(buff.stat);
        }
        this.buffs.set(buff.id, buff);

        if (buff.onApply) {
            buff.onApply(this.target);
        }
    }

    /** 移除buff */
    removeBuff(buffId: string): void {
        const buff = this.buffs.get(buffId);
        if (buff && buff.onRemove) {
            buff.onRemove(this.target);
        }
        this.buffs.delete(buffId);
    }

    /** 移除指定属性的所有buff */
    removeBuffsByStat(stat: StatType): void {
        for (const [id, buff] of this.buffs.entries()) {
            if (buff.stat === stat) {
                this.removeBuff(id);
            }
        }
    }

    /** 获取所有生效中的buff */
    getActiveBuffs(): Buff[] {
        return Array.from(this.buffs.values());
    }

    /** 更新buff状态 */
    update(): void {
        for (const [id, buff] of this.buffs.entries()) {
            if (buff.onTick) {
                buff.onTick(this.target);
            }
            
            buff.duration--;
            if (buff.duration <= 0) {
                this.removeBuff(id);
            }
        }
    }
} 