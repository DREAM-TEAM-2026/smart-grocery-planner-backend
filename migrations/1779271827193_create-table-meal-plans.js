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
  pgm.createTable('meal_plans', {
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
    recipe_id: {
      type: 'UUID',
      notNull: true,
      references: '"public"."recipes"',
      onDelete: 'CASCADE',
    },
    scheduled_date: {
      type: 'DATE',
      notNull: true,
    },
    meal_type: {
      type: 'meal_type_enum',
      notNull: true,
    },
  });

  pgm.createIndex('meal_plans', 'user_id');
  pgm.createIndex('meal_plans', 'recipe_id');

  pgm.addConstraint('meal_plans', 'unique_user_meal_schedule', {
    unique: ['user_id', 'scheduled_date', 'meal_type'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('meal_plans', { cascade: true });
};
