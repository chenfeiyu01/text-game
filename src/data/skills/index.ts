import { Skill } from "../../constants/skill-list";
import { StatType } from "../../constants/stats";

/** 基础技能 */
const BASIC_SKILLS: Skill[] = [
    {
        id: 'fireball',
        name: '火球术',
        damage: 50,
        manaCost: 30,
        chargeCost: 100,
        description: '发射一个火球，造成范围伤害。熟练掌握的火球术会产生额外的灼烧效果。',
        requiredLevel: 1,
        cost: 0,
        damageType: 'magic'
    }
];

/** 进阶技能 */
const ADVANCED_SKILLS: Skill[] = [
    {
        id: 'thunder_strike',
        name: '雷霆一击',
        damage: 120,
        manaCost: 45,
        chargeCost: 100,
        description: '召唤雷电打击敌人，有几率使目标麻痹一回合。',
        requiredLevel: 5,
        cost: 200,
        damageType: 'magic',
        effects: [
            {
                type: 'stun',
                chance: 0.3,
                duration: 1
            }
        ]
    },
    {
        id: 'blade_storm',
        name: '剑刃风暴',
        damage: 80,
        manaCost: 40,
        chargeCost: 100,
        description: '释放多次剑气攻击，每次攻击都有独立的暴击判定。',
        requiredLevel: 8,
        cost: 300,
        damageType: 'physical',
        hitCount: 3
    }
];

/** 精英技能 */
const ELITE_SKILLS: Skill[] = [
    {
        id: 'dragon_rage',
        name: '龙之怒焰',
        damage: 200,
        manaCost: 80,
        chargeCost: 100,
        description: '释放龙族之力，造成巨大伤害并提升自身攻击力。',
        requiredLevel: 15,
        cost: 800,
        damageType: 'magic',
        effects: [
            {
                type: 'buff',
                stat: StatType.ATTACK,
                value: 0.2,
                duration: 3
            }
        ]
    },
    {
        id: 'shadow_assault',
        name: '暗影突袭',
        damage: 150,
        manaCost: 60,
        chargeCost: 100,
        description: '瞬间移动到敌人身后发动致命一击，必定暴击且无视目标30%防御。',
        requiredLevel: 12,
        cost: 600,
        damageType: 'physical',
        effects: [
            {
                type: 'guaranteed_crit',
                defenseReduction: 0.3
            }
        ]
    }
];

/** 终极技能 */
const ULTIMATE_SKILLS: Skill[] = [
    {
        id: 'celestial_judgment',
        name: '天之裁决',
        damage: 300,
        manaCost: 100,
        chargeCost: 100,
        description: '召唤天界之力进行审判，造成巨大的神圣伤害，并治疗自身。',
        requiredLevel: 20,
        cost: 1500,
        damageType: 'magic',
        effects: [
            {
                type: 'heal',
                value: 0.2, // 基于最大生命值的20%
            }
        ]
    },
    {
        id: 'thousand_blades',
        name: '千刃飞舞',
        damage: 80,
        manaCost: 120,
        chargeCost: 100,
        description: '召唤无数飞剑进行打击，造成多段伤害并降低目标防御。',
        requiredLevel: 20,
        cost: 1500,
        damageType: 'physical',
        hitCount: 8,
        effects: [
            {
                type: 'debuff',
                stat: StatType.DEFENSE,
                value: -0.3,
                duration: 2
            }
        ]
    }
];

/** 所有技能列表 */
export const SKILL_LIST: Skill[] = [
    ...BASIC_SKILLS,
    ...ADVANCED_SKILLS,
    ...ELITE_SKILLS,
    ...ULTIMATE_SKILLS
];