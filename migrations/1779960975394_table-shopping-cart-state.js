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
  pgm.createTable('shopping_cart_states', {
    id: { type: 'UUID', notNull: true, primaryKey: true },
    user_id: { type: 'UUID', notNull: true, references: '"neon_auth"."user"', onDelete: 'CASCADE' },
    start_date: { type: 'DATE', notNull: true },
    end_date: { type: 'DATE', notNull: true },
    generated_at: { type: 'TIMESTAMP', notNull: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('shopping_cart_states', { cascade: true });
};
