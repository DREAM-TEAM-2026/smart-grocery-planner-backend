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
  pgm.createTable('ingredients', {
    id: { type: 'UUID', primaryKey: true },
    name: { type: 'VARCHAR(255)', notNull: true, unique: true }, // Nama bahan unik!
    category: { type: 'ingredient_category', notNull: true },
  });

  pgm.createTable('user_ingredients', {
    id: {
      type: 'UUID',
      primaryKey: true,
    },
    user_id: {
      type: 'UUID',
      references: '"neon_auth"."user"',
      onDelete: 'CASCADE',
      notNull: true,
    },
    ingredient_id: {
      type: 'UUID',
      references: '"public"."ingredients"',
      onDelete: 'CASCADE',
      notNull: true,
    },
    quantity: {
      type: 'SMALLINT',
      notNull: true,
      default: 0,
    },
    unit: { type: 'VARCHAR(50)', notNull: true },
  });

  pgm.createIndex('user_ingredients', 'user_id');

  pgm.addConstraint('user_ingredients', 'unique_user_ingredient_unit', {
    unique: ['user_id', 'ingredient_id', 'unit'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('user_ingredients', { cascade: true });
  pgm.dropTable('ingredients', { cascade: true });
};
