DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'archived'
      AND enumtypid = 'need_status'::regtype
  ) THEN
    ALTER TYPE need_status ADD VALUE 'archived';
  END IF;
END $$;
