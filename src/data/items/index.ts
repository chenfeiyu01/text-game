import { Item, ItemId } from '../../constants/item';
import { CONSUMABLES } from './consumables';
import { GEARS } from './gears';

export const ITEMS: Record<ItemId, Item> = {
    ...CONSUMABLES,
    ...GEARS
}
