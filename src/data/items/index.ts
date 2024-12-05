import { Item, ItemId } from '../../constants/item';
import { CONSUMABLES } from './consumables';
import { GEARS } from './gears';
import { ARMORS } from './gears/armors';

export const ITEMS: Record<ItemId, Item> = {
    ...CONSUMABLES,
    ...GEARS,
    ...ARMORS
}
