USE review_kantin;
GO

-- ============================================================
-- Trigger append-only: menolak UPDATE dan DELETE pada AUDIT_LOGS
-- Audit log hanya boleh INSERT dan SELECT.
-- ============================================================

IF OBJECT_ID('dbo.TR_AUDIT_LOGS_AppendOnly', 'TR') IS NOT NULL
    DROP TRIGGER dbo.TR_AUDIT_LOGS_AppendOnly;
GO

CREATE TRIGGER TR_AUDIT_LOGS_AppendOnly
ON dbo.AUDIT_LOGS
INSTEAD OF UPDATE, DELETE
AS
BEGIN
    THROW 50010, 'AUDIT_LOGS bersifat append-only. UPDATE dan DELETE tidak diizinkan.', 1;
END;
GO

-- ============================================================
-- Index untuk mempercepat query audit log
-- ============================================================

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_AUDIT_LOGS_created_at'
      AND object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
)
BEGIN
    CREATE INDEX IX_AUDIT_LOGS_created_at
        ON dbo.AUDIT_LOGS (created_at DESC, id DESC);
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_AUDIT_LOGS_user_created'
      AND object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
)
BEGIN
    CREATE INDEX IX_AUDIT_LOGS_user_created
        ON dbo.AUDIT_LOGS (user_id, created_at DESC);
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_AUDIT_LOGS_action_target_created'
      AND object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
)
BEGIN
    CREATE INDEX IX_AUDIT_LOGS_action_target_created
        ON dbo.AUDIT_LOGS (action, target_table, created_at DESC);
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = N'IX_AUDIT_LOGS_target_id'
      AND object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
)
BEGIN
    CREATE INDEX IX_AUDIT_LOGS_target_id
        ON dbo.AUDIT_LOGS (target_id, created_at DESC);
END
GO

PRINT 'Trigger append-only dan index audit siap.';
GO
