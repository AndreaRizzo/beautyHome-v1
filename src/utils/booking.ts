import { BookingItem, OperatorProfile, Treatment } from '@/models/types';

export const getRequiredTreatmentIds = (items: BookingItem[]) => {
  return Array.from(new Set(items.map((item) => item.treatmentId)));
};

export const operatorOffersAll = (operator: OperatorProfile, requiredIds: string[]) => {
  if (!operator.offeredTreatmentIds.length) return false;
  if (!requiredIds.length) return operator.offeredTreatmentIds.length > 0;
  return requiredIds.every((id) => operator.offeredTreatmentIds.includes(id));
};

export const countServicesOffered = (operator: OperatorProfile, treatments: Treatment[]) => {
  const available = new Set(treatments.map((item) => item.id));
  return operator.offeredTreatmentIds.filter((id) => available.has(id)).length;
};
