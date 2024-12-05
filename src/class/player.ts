import { Character } from './character';
import { Skill } from '../constants/skill-list';
import { Inventory } from './inventory';
import { isGearItem } from '../constants/item';
import { QuestSystem } from './quest-system';
import { QuestObjectiveType } from '../constants/quest'

interface PlayerConfig {
    name: string;
    maxHp: number;
    maxMp: number;
    attack: number;
    defense: number;
    critRate: number;
    critDamage: number;
    chargeRate: number;
    equippedSkill?: Skill;
}

export class Player extends Character {
    private static instance: Player;
    /** 已学习的技能集合 */
    private _skills: Set<string> = new Set();

    get skills(): Set<string> { return this._skills; }

    private constructor(config: PlayerConfig) {
        super(config);
    }

    public static getInstance(): Player {
        if (!Player.instance) {
            throw new Error('Player not initialized. Call initializePlayer first.');
        }
        return Player.instance;
    }

    public static initializePlayer(config: PlayerConfig): Player {
        Player.instance = new Player(config);
        return Player.instance;
    }

    public learnSkill(skill: Skill): boolean {
        this._skills.add(skill.id);
        this.updateState();

        // 更新任务进度
        QuestSystem.getInstance().updateQuestProgress(
            'NEWBIE_TRAINING',
            QuestObjectiveType.LEARN_SKILL,
            skill.id
        );

        return true;
    }

    /** 序列化玩家数据 */
    serialize() {
        return {
            name: this.name,
            level: this.level,
            exp: this.exp,
            maxHp: this.maxHp,
            maxMp: this.maxMp,
            hp: this.hp,
            mp: this.mp,
            attack: this.attack,
            defense: this.defense,
            critRate: this.critRate,
            critDamage: this.critDamage,
            chargeRate: this.chargeRate,
            equippedSkillId: this.equippedSkill?.id,
            skills: Array.from(this._skills),
            equippedItems: Object.entries(this.equippedItems).map(([slot, item]) => ({
                slot,
                itemId: item?.id,
                enhanceLevel: item?.enhanceLevel
            })),
            inventory: {
                items: Object.fromEntries(
                    this.inventory.getItems().map(({ item, quantity }) => [
                        item.id,
                        {
                            item: {
                                ...item,
                                enhanceLevel: isGearItem(item) ? item.enhanceLevel : undefined
                            },
                            quantity
                        }
                    ])
                ),
                gold: this.inventory.gold
            }
        } as const;
    }
}