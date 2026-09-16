/**
 * =============================================================================
 * PRANAV CRACKERS - CATEGORIES CONFIGURATION
 * File: data/categories/categories.js
 * =============================================================================
 * 
 * HOW TO USE THIS FILE:
 * - You can add, edit, or re-order categories displayed in the carousel and rate sheet.
 * - Each category has:
 *   - key: Unique category identifier (matches 'category' in data/crackers/crackers.js)
 *   - title: Human-readable display name
 *   - icon: Category icon / emoji
 *   - image: Default category illustration image
 *   - displayOrder: Order in which the category pill appears
 * =============================================================================
 */

const CRACKER_CATEGORIES = [
    {
        key: 'all',
        title: 'All Products',
        icon: '🎆',
        image: 'assets/images/gift_box.jpg',
        displayOrder: 1
    },
    {
        key: 'sparklers',
        title: 'Sparklers',
        icon: '✨',
        image: 'assets/images/sparklers.jpg',
        displayOrder: 2
    },
    {
        key: 'flower_pots',
        title: 'Flower Pots',
        icon: '🌋',
        image: 'assets/images/flower_pots.jpg',
        displayOrder: 3
    },
    {
        key: 'ground_chakkars',
        title: 'Ground Chakkars',
        icon: '🌀',
        image: 'assets/images/ground_chakkars.jpg',
        displayOrder: 4
    },
    {
        key: 'sound_crackers',
        title: 'Sound Crackers',
        icon: '💥',
        image: 'assets/images/sound_crackers.jpg',
        displayOrder: 5
    },
    {
        key: 'bombs',
        title: 'Bombs',
        icon: '💣',
        image: 'assets/images/bombs.jpg',
        displayOrder: 6
    },
    {
        key: 'rockets',
        title: 'Rockets',
        icon: '🚀',
        image: 'assets/images/sky_rockets.jpg',
        displayOrder: 7
    },
    {
        key: 'sky_shots',
        title: 'Sky Shots',
        icon: '🌌',
        image: 'assets/images/sky_shots.jpg',
        displayOrder: 8
    },
    {
        key: 'fancy_items',
        title: 'Novelties',
        icon: '🦚',
        image: 'assets/images/fancy_items.jpg',
        displayOrder: 9
    },
    {
        key: 'garlands',
        title: 'Garlands',
        icon: '🎇',
        image: 'assets/images/garlands.jpg',
        displayOrder: 10
    },
    {
        key: 'gift_boxes',
        title: 'Gift Boxes',
        icon: '🎁',
        image: 'assets/images/gift_box.jpg',
        displayOrder: 11
    }
];

if (typeof window !== 'undefined') {
    window.CRACKER_CATEGORIES = CRACKER_CATEGORIES;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CRACKER_CATEGORIES };
}
