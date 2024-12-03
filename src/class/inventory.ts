import { Item, InventoryItem, ItemId } from '../constants/item';

export class Inventory {
    private items: Map<ItemId, InventoryItem> = new Map();
    private _gold: number = 0;

    get gold(): number {
        return this._gold;
    }

    addGold(amount: number): void {
        this._gold += amount;
        this.notifyUpdate();
    }

    getGold(): number {
        return this._gold;
    }

    removeGold(amount: number): boolean {
        if (this._gold >= amount) {
            this._gold -= amount;
            this.notifyUpdate();
            return true;
        }
        return false;
    }

    addItem(item: Item, quantity: number = 1): boolean {
        const existingItem = this.items.get(item.id);

        if (existingItem) {
            if (item.stackable) {
                const newQuantity = existingItem.quantity + quantity;
                if (!item.maxStack || newQuantity <= item.maxStack) {
                    existingItem.quantity = newQuantity;
                    this.notifyUpdate();
                    return true;
                }
            }
            return false;
        }

        this.items.set(item.id, { item, quantity });
        this.notifyUpdate();
        return true;
    }

    removeItem(itemId: ItemId, quantity: number = 1): boolean {
        const existingItem = this.items.get(itemId);
        if (!existingItem || existingItem.quantity < quantity) {
            return false;
        }

        existingItem.quantity -= quantity;
        if (existingItem.quantity <= 0) {
            this.items.delete(itemId);
        }

        this.notifyUpdate();
        return true;
    }

    getItems(): InventoryItem[] {
        return Array.from(this.items.values());
    }

    hasItem(itemId: ItemId, quantity: number = 1): boolean {
        const item = this.items.get(itemId);
        return !!item && item.quantity >= quantity;
    }

    private updateCallbacks: Set<() => void> = new Set();

    onUpdate(callback: () => void): () => void {
        this.updateCallbacks.add(callback);
        return () => this.updateCallbacks.delete(callback);
    }

    private notifyUpdate(): void {
        this.updateCallbacks.forEach(callback => callback());
    }
} 