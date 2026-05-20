/* eslint-disable camelcase */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
// export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('recipe_ingredients', {
    id: {
      type: 'UUID',
      primaryKey: true,
    },
    recipe_id: {
      type: 'UUID',
      notNull: true,
      references: '"public"."recipes"',
      onDelete: 'CASCADE',
    },
    ingredient_id: {
      type: 'UUID',
      notNull: true,
      references: '"public"."ingredients"',
      onDelete: 'CASCADE',
    },
    quantity_required: {
      type: 'SMALLINT',
      notNull: true,
      check: 'quantity_required > 0',
    },
    unit: { type: 'VARCHAR(50)', notNull: true },
  });

  pgm.createIndex('recipe_ingredients', 'recipe_id');
  pgm.createIndex('recipe_ingredients', 'ingredient_id');

  pgm.addConstraint('recipe_ingredients', 'unique_recipe_ingredient_unit', {
    unique: ['recipe_id', 'ingredient_id', 'unit'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('recipe_ingredients', { cascade: true });
};
