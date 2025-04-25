import { MathUtils } from "three"

export const randomElement = (items) => {
    const range = MathUtils.randInt(0, items.length - 1);

    return items[range]
}