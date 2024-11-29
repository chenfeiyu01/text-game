import { SCENES } from "../data/maps/scenes";

export class SceneManager {
    private currentScene: Scene;
    private currentBattleIndex: number = 0;

    constructor(sceneId: string) {
        const scene = SCENES[sceneId];
        if (!scene) {
            throw new Error(`Scene ${sceneId} not found`);
        }
        this.currentScene = scene;
    }

    getCurrentBattle(): BattleEncounter | null {
        if (this.currentBattleIndex >= this.currentScene.battles.length) {
            return null; // 场景完成
        }
        return this.currentScene.battles[this.currentBattleIndex];
    }

    nextBattle(): BattleEncounter | null {
        this.currentBattleIndex++;
        return this.getCurrentBattle();
    }

    isSceneComplete(): boolean {
        return this.currentBattleIndex >= this.currentScene.battles.length;
    }

    getSceneInfo() {
        return {
            name: this.currentScene.name,
            description: this.currentScene.description,
            progress: `${this.currentBattleIndex + 1}/${this.currentScene.battles.length}`
        };
    }
} 