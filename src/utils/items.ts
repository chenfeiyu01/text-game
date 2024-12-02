import { Item, ItemId } from "../constants/item";
import { ITEMS } from "../data/items";

export const getItemById = (id: string): Item | undefined => {
    return ITEMS[id as ItemId];
}; 