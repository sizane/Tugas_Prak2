import { reqString, toId } from '../utils/validate.ts';

export type CreateAuditLogDto = { userId: number; action: string; targetTable: string; targetId: number; metadata: string | null };

export function parseCreateAuditLog(b: any): CreateAuditLogDto {
  const m = b?.metadata;
  return {
    userId: toId(b?.userId, 'userId'),
    action: reqString(b, 'action', 50).toUpperCase(),
    targetTable: reqString(b, 'targetTable', 50).toUpperCase(),
    targetId: toId(b?.targetId, 'targetId'),
    metadata: m === undefined || m === null ? null : typeof m === 'string' ? m : JSON.stringify(m),
  };
}
