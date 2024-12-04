import { DropRule, SceneDropModifier } from "../../constants/drop";
import { Monsters } from "../../constants/monsters";
import { MONSTER_DROPS as LOW_LEVEL_MONSTER_DROPS, SCENE_DROP_MODIFIERS as LOW_LEVEL_SCENE_DROP_MODIFIERS } from "./lowLevel";

/** 所有怪物掉落配置 */
export const MONSTER_DROPS: Record<Monsters, DropRule[]> = {
    ...LOW_LEVEL_MONSTER_DROPS
};

/** 所有场景掉落修正配置 */
export const SCENE_DROP_MODIFIERS: Record<string, SceneDropModifier> = {
    ...LOW_LEVEL_SCENE_DROP_MODIFIERS
};
