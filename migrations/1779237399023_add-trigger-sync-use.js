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
  pgm.sql(`
    CREATE OR REPLACE FUNCTION public.sync_neon_auth_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.users (id, username, fullname)
      VALUES (
        NEW.id, 
        'user_' || NEW.id::text,
        COALESCE(NEW.name, 'New User')
      )
      ON CONFLICT (id) DO NOTHING;  

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

  pgm.sql(`
    CREATE TRIGGER trigger_sync_neon_auth_user
    AFTER INSERT ON neon_auth.user
    FOR EACH ROW EXECUTE FUNCTION public.sync_neon_auth_user();
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(
    'DROP TRIGGER IF EXISTS trigger_sync_neon_auth_user ON neon_auth.user;',
  );
  pgm.sql('DROP FUNCTION IF EXISTS public.sync_neon_auth_user();');
};
