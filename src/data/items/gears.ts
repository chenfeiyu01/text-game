import { GearItem, GearItemId, GearSlot, ItemRarity, ItemType } from "../../constants/item";
import { GameSystem } from "../../class/game-system";
import { MessageType } from "../../constants/game-system";

export const GEARS: Record<GearItemId, GearItem> = {
    [GearItemId.WOODEN_SWORD]: {
        id: GearItemId.WOODEN_SWORD,
        name: '木剑',
        description: '一把普通的练习用木剑，适合初学者使用',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.WEAPON,
        stats: {
            attack: 5,
            critRate: 0.05
        },
        isEnhanceable: true,
        price: 10
    },
    [GearItemId.IRON_SWORD]: {
        id: GearItemId.IRON_SWORD,
        name: '铁剑',
        description: '一把铁匠铺随处可见的铁剑，出师必备',
        type: ItemType.GEAR,
        rarity: ItemRarity.COMMON,
        stackable: false,
        slot: GearSlot.WEAPON,
        stats: {
            attack: 10,
            critRate: 0.08,
            critDamage: 0.2
        },
        isEnhanceable: true,
        price: 20,
        effects: [{
            description: '每次暴击后增加10%攻击力，持续3回合',
            type: 'onHit',
            condition: 'isCritical',
            effect: (character) => {
                const baseAttack = character.attack;
                const bonusAttack = Math.floor(baseAttack * 0.1);
                const effectId = `iron_sword_crit_${Date.now()}`;
                
                character.addTemporaryEffect(
                    effectId,
                    'attack',
                    bonusAttack,
                    3
                );

                GameSystem.getInstance().sendMessage(
                    MessageType.COMBAT,
                    `铁剑效果触发：攻击力提升${bonusAttack}点，持续3回合`
                );
            }
        }]
    }
};