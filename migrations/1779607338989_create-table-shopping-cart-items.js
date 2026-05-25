/* eslint-disable camelcase */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
// export const shorthands = undefined;a

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('shopping_cart_items', {
    id: { type: 'UUID', notNull: true, primaryKey: true },
    user_id: { type: 'UUID', notNull: true, references: '"neon_auth"."user"' },
    ingredient_name: { type: 'VARCHAR(50)', notNull: true },
    required_amount: { type: 'SMALLINT', notNull: true },
    is_checked: { type: 'BOOLEAN' },
    recipe_sources: { type: 'JSONB', notNull: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('shopping_cart_items');
};
