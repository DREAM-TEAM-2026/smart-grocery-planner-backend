/* eslint-disable camelcase */

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
  pgm.createTable('scheduled_meals', {
    id: { type: 'UUID', primaryKey: true },
    user_id: {
      type: 'UUID',
      references: '"neon_auth"."user"',
      onDelete: 'CASCADE',
    },
    scheduled_date: { type: 'DATE', notNull: true },
    meal_type: { type: 'meal_type_enum', notNull: true },
    recipe_name: { type: 'VARCHAR(100)', notNull: true },
    minutes: { type: 'SMALLINT' },
    calories: { type: 'SMALLINT', notNull: true },
    ingredients: { type: 'TEXT[]', notNull: true },
    cooking_steps: { type: 'TEXT[]', notNull: true },
    updated_at: { type: 'TIMESTAMP' },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('scheduled_meals', { cascade: true });
};
