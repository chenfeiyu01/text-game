import { NpcConfig, NpcFunction, NpcDialog } from '../constants/npc';
import { GearItem, isGearItem, Item, ItemId } from '../constants/item';
import { Player } from './player';
import { Skill, SKILL_LIST } from '../constants/skill-list';
import { calculateEnhanceCost, enhanceGear } from '../constants/item';
import { EnhanceNpcConfig, NPC_CONFIGS, ShopNpcConfig, SkillTrainerNpcConfig } from '../constants/npc-config';

/**
 * NPC基类
 * 定义了NPC的基本属性和功能
 */
export class Npc {
    /** NPC配置信息 */
    private readonly config: NpcConfig;
    /** 当前对话ID */
    private currentDialogId: string;

    constructor(config: NpcConfig) {
        this.config = config;
        this.currentDialogId = config.defaultDialogId;
    }

    /** 获取NPC ID */
    get id() { return this.config.id; }
    /** 获取NPC名称 */
    get name() { return this.config.name; }
    /** 获取NPC描述 */
    get description() { return this.config.description; }
    /** 获取NPC功能列表 */
    get functions() { return this.config.functions; }

    /** 获取当前对话内容 */
    getCurrentDialog(): NpcDialog {
        return this.config.dialogs[this.currentDialogId];
    }

    /** 设置当前对话ID */
    setDialog(dialogId: string) {
        if (this.config.dialogs[dialogId]) {
            this.currentDialogId = dialogId;
        }
    }

    /** 检查NPC是否拥有指定功能 */
    hasFunction(func: NpcFunction): boolean {
        return this.functions.includes(func);
    }

    static getConfig(npcId: keyof typeof NPC_CONFIGS) {
        return NPC_CONFIGS[npcId];
    }
}

/**
 * 商店NPC类
 * 提供购买和出售物品的功能
 */
export class ShopNpc extends Npc {
    /** 商店出售的物品列表 */
    private _items: Item[] = [];
    /** 购买价格倍率 */
    private _buyRates: Record<string, number> = {};
    /** 出售价格倍率 */
    private _sellRates: Record<string, number> = {};

    constructor(config: NpcConfig, items: Item[]) {
        super(config);
        this._items = items;
    }

    /** 获取商店可购买的物品列表 */
    getShopItems(): Item[] {
        return this._items;
    }

    /** 计算物品的购买价格 */
    getBuyPrice(item: Item): number {
        const basePrice = item.price || 0;
        const rate = this._buyRates[item.id] || 1;
        return Math.floor(basePrice * rate);
    }

    /** 计算物品的出售价格 */
    getSellPrice(item: Item): number {
        const basePrice = item.price || 0;
        const rate = this._sellRates[item.id] || 0.5;
        return Math.floor(basePrice * rate);
    }

    /** 玩家购买物品 */
    buyItem(player: Player, itemId: ItemId, quantity: number = 1): boolean {
        const item = this._items.find(i => i.id === itemId);
        if (!item) return false;

        const totalPrice = this.getBuyPrice(item) * quantity;
        if (player.money < totalPrice) return false;

        player.money -= totalPrice;
        player.inventory.addItem(item, quantity);
        return true;
    }

    /** 玩家出售物品 */
    sellItem(player: Player, itemId: ItemId, quantity: number = 1): boolean {
        const item = player.inventory.getItems().find(i => i.item.id === itemId);
        if (!item) return false;

        const totalPrice = this.getSellPrice(item.item) * quantity;
        player.money += totalPrice;
        player.inventory.removeItem(itemId, quantity);
        return true;
    }

    static create(npcId: keyof typeof NPC_CONFIGS) {
        const config = NPC_CONFIGS[npcId] as ShopNpcConfig;
        if (!config || !config.goods) {
            throw new Error(`Invalid shop NPC config: ${npcId}`);
        }
        return new ShopNpc(config, config.goods);
    }
}

/**
 * 强化NPC类
 * 提供装备强化功能
 */
export class EnhanceNpc extends Npc {
    enhanceEquipment(player: Player, itemId: ItemId): {
        success: boolean;
        message: string;
        stats?: GearItem['stats'];
    } {
        const item = player.inventory.getItems().find(i => i.item.id === itemId);
        if (!item || !isGearItem(item.item)) {
            return {
                success: false,
                message: '无效的装备'
            };
        }

        const cost = calculateEnhanceCost(item.item);
        if (player.money < cost) {
            return {
                success: false,
                message: '金币不足'
            };
        }

        const result = enhanceGear(item.item);

        if (result.success) {
            player.money -= cost;
            return {
                success: true,
                message: `强化成功！${item.item.name}提升至+${item.item.enhanceLevel}级`,
                stats: result.stats
            };
        } else {
            return {
                success: false,
                message: '强化失败'
            };
        }
    }

    static create(npcId: keyof typeof NPC_CONFIGS) {
        console.log(npcId);
        const config = NPC_CONFIGS[npcId] as EnhanceNpcConfig;
        if (!config) {
            throw new Error(`Invalid enhance NPC config: ${npcId}`);
        }
        return new EnhanceNpc(config);
    }
}

/**
 * 技能训练师NPC类
 * 提供技能学习功能
 */
export class SkillTrainerNpc extends Npc {
    /** 可学习的技能列表 */
    private _availableSkills: Skill[] = SKILL_LIST;

    constructor(config: NpcConfig) {
        super(config);
        this._availableSkills = SKILL_LIST;
    }

    /** 获取可学习的技能列表 */
    getAvailableSkills(): Skill[] {
        return this._availableSkills;
    }

    /** 学习技能 */
    teachSkill(player: Player, skillId: string): boolean {
        const skill = this._availableSkills.find(s => s.id === skillId);
        if (!skill) return false;

        if (player.skills.has(skillId)) return false;
        if (player.level < skill.requiredLevel) return false;
        if (player.money < skill.cost) return false;

        player.money -= skill.cost;
        player.learnSkill(skill);
        return true;
    }

    static create(npcId: keyof typeof NPC_CONFIGS) {
        const config = NPC_CONFIGS[npcId] as SkillTrainerNpcConfig;
        if (!config || !config.skills) {
            throw new Error(`Invalid skill trainer NPC config: ${npcId}`);
        }
        return new SkillTrainerNpc(config, config.skills);
    }
} 