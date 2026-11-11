import { bad } from '../utils/validate.ts';

export const FLAG_STATUSES = ['pending', 'resolved', 'dismissed'] as const;
export type FlagStatus = (typeof FLAG_STATUSES)[number];

export function parseFlagStatus(b: any): FlagStatus {
  if (!FLAG_STATUSES.includes(b?.status)) throw bad(`status harus salah satu dari: ${FLAG_STATUSES.join(', ')}`);
  return b.status;
}
