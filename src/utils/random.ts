export const RandomUtils = {
    getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    },

    shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    getWeightedResult<T>(weightedResults: { weight: number; result: T }[]): T {
        const totalWeight = weightedResults.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of weightedResults) {
            random -= item.weight;
            if (random <= 0) {
                return item.result;
            }
        }
        
        return weightedResults[0].result;
    }
};
