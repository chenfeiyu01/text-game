import { PIGLET_CONFIG } from "./piglet";
import { SLIME_CONFIG } from "./slime";
import { GOBLIN_CONFIG } from "./goblin";

import { Monsters } from "../../../constants/monsters";
import { CharacterConfig } from "../../../class/character";

const MONSTERS: Record<Monsters, CharacterConfig> = {
    [Monsters.SLIME]: SLIME_CONFIG,
    [Monsters.PIGLET]: PIGLET_CONFIG,
    [Monsters.GOBLIN]: GOBLIN_CONFIG,
}

export default MONSTERS;