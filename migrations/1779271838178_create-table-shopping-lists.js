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
  pgm.createTable('shopping_lists', {
    id: {
      type: 'UUID',
      primaryKey: true,
    },
    user_id: {
      type: 'UUID',
      notNull: true,
      references: '"neon_auth"."user"',
      onDelete: 'CASCADE',
    },
    ingredient_id: {
      type: 'UUID',
      notNull: true,
      references: '"public"."ingredients"',
      onDelete: 'CASCADE',
    },
    quantity_needed: {
      type: 'SMALLINT',
      notNull: true,
      check: 'quantity_needed > 0',
    },
    unit: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_purchased: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    week_start_date: {
      type: 'DATE',
      notNull: true,
    },
  });

  pgm.createIndex('shopping_lists', ['user_id', 'week_start_date']);

  pgm.addConstraint('shopping_lists', 'unique_user_weekly_ingredient_unit', {
    unique: ['user_id', 'ingredient_id', 'unit', 'week_start_date'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('shopping_lists', { cascade: true });
};
