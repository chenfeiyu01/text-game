import { WEAPONS } from './weapons';
import { ARMORS } from './armors';
import { ACCESSORIES } from './accessories';
import { GearItem, GearItemId } from '../../../constants/item';

export const GEARS: Record<GearItemId, GearItem> = {
    ...WEAPONS,
    ...ARMORS,
    ...ACCESSORIES
}; 