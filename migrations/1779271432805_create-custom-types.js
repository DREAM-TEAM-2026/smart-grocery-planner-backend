/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createType('ingredient_category', [
    'Veggies',
    'Fruit',
    'Proteins',
    'Spices',
    'Dairy',
    'Carbs',
    'Nuts',
    'Others',
  ]);

  pgm.createType('meal_type_enum', ['breakfast', 'lunch', 'dinner']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropType('meal_type_enum');
  pgm.dropType('ingredient_category');
};
