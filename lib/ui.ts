const EMOJI: Record<string, string> = { "food-boxes": "🍱", "small-chops": "🥟", "spices-leaves": "🌿", "grains-seeds": "🫘", "drinks-teas": "🍹" };
export const catEmoji = (slug?: string | null) => (slug && EMOJI[slug]) || "🍽";
