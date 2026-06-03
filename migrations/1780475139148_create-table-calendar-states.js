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
  pgm.createTable('calendar_states', {
    id: { type: 'UUID', primaryKey: true },
    user_id: { type: 'UUID', notNull: true, references: '"neon_auth"."user"' },
    generated_at: { type: 'TIMESTAMP', notNull: true, default: pgm.func('NOW()')  },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('calendar_states', { cascade: true });
};
