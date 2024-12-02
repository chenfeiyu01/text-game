import { SKILL_LIST, Skill } from "../constants/skill-list";

export const getSkillById = (id: string): Skill | undefined => {
    return SKILL_LIST.find(skill => skill.id === id);
}