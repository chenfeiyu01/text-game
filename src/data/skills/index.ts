import { Skill, SkillEffectType } from '../../constants/skill-list';
import { StatType } from '../../constants/stats';
import { SkillImpl } from '../../constants/skill-list';
import { BuffSourceType, BuffType } from '../../constants/buff';
import { DamageType } from '../../constants/battle';

/** 基础技能 */
const BASIC_SKILLS: Skill[] = [
    new SkillImpl(
        'test-skill-1',
        '测试用技能',
        '测试用技能',
        [
            {
                type: SkillEffectType.BUFF,
                buff: {
                    id: 'test-skill-1-buff',
                    name: '力量增幅',
                    description: '提升攻击力',
                    duration: 2,
                    type: BuffType.ATTRIBUTE,
                    stat: StatType.ATTACK,
                    value: 3,
                    isPercentage: false,
                    source: BuffSourceType.SKILL
                }
            }
        ],
        30,
        100,
        0,
        1,
        50,
        DamageType.MAGIC
    )
];

/** 进阶技能 */
const ADVANCED_SKILLS: Skill[] = [
    new SkillImpl(
        'thunder_strike',
        '雷霆一击',
        '释放强大的雷电能量，造成魔法伤害并有几率使目标眩晕。',
        [
            {
                type: SkillEffectType.STUN,
                chance: 0.3,
                duration: 1
            }
        ],
        35,
        100,
        200,
        5,
        120,
        DamageType.MAGIC
    ),
    new SkillImpl(
        'blade_storm',
        '剑刃风暴',
        '释放多次剑气攻击，每次攻击都有独立的暴击判定。',
        [
            {
                type: SkillEffectType.DAMAGE,
                damageType: DamageType.PHYSICAL,
                value: 100,
                isPercentage: false
            }
        ],
        40,
        100,
        300,
        8,
        80,
        DamageType.PHYSICAL
    )
];

/** 精英技能 */
const ELITE_SKILLS: Skill[] = [
    new SkillImpl(
        'dragon_rage',
        '龙之怒焰',
        '释放龙族之力，造成巨大伤害并提升自身攻击力。',
        [
            {
                type: SkillEffectType.BUFF,
                buff: {
                    id: 'dragon-rage-buff',
                    name: '龙之力',
                    description: '龙族之力增幅攻击力',
                    duration: 3,
                    type: BuffType.ATTRIBUTE,
                    stat: StatType.ATTACK,
                    value: 0.2,
                    isPercentage: true,
                    source: BuffSourceType.SKILL
                }
            }
        ],
        80,
        100,
        800,
        15,
        200,
        DamageType.MAGIC
    ),
    new SkillImpl(
        'shadow_assault',
        '暗影突袭',
        '瞬间接近目标进行致命一击，必定暴击并无视部分防御。',
        [
            {
                type: SkillEffectType.GUARANTEED_CRIT,
                defenseReduction: 0.3
            }
        ],
        60,
        100,
        800,
        15,
        150,
        DamageType.PHYSICAL
    )
];

/** 终极技能 */
const ULTIMATE_SKILLS: Skill[] = [
    new SkillImpl(
        'celestial_judgment',
        '天之裁决',
        '召唤天界之力进行审判，造成巨大的神圣伤害，并治疗自身。',
        [
            {
                type: SkillEffectType.HEAL,
                value: 0.2
            }
        ],
        100,
        100,
        1500,
        20,
        300,
        DamageType.MAGIC
    ),
    new SkillImpl(
        'thousand_blades',
        '千刃飞舞',
        '召唤无数飞剑进行打击，造成多段伤害并降低目标防御。',
        [
            {
                type: SkillEffectType.DEBUFF,
                buff: {
                    id: 'thousand-blades-debuff',
                    name: '破甲',
                    description: '防御力降低',
                    duration: 2,
                    type: BuffType.ATTRIBUTE,
                    stat: StatType.DEFENSE,
                    value: 0.3,
                    isPercentage: true,
                    source: BuffSourceType.SKILL
                }
            }
        ],
        120,
        100,
        1500,
        20,
        80,
        DamageType.PHYSICAL
    )
];

/** 所有技能列表 */
export const SKILL_LIST: Skill[] = [
    ...BASIC_SKILLS,
    ...ADVANCED_SKILLS,
    ...ELITE_SKILLS,
    ...ULTIMATE_SKILLS
];
