import { Skill } from "../constants/skill-list";
import { SKILL_LIST } from "../data/skills";

export const getSkillById = (id: string): Skill | undefined => {
    return SKILL_LIST.find(skill => skill.id === id);
}