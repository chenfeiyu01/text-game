import { Item, ItemId } from "../constants/item";
import { ITEMS } from "../data/items";

export function getItemById(id: ItemId): Item | undefined {
    return ITEMS[id as ItemId];
}