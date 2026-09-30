import { Opportunity } from '@/types';
import { MOCK_OPPORTUNITIES } from '@/lib/mockData';

let memoryOpportunities: Opportunity[] = [...MOCK_OPPORTUNITIES];

export async function getAllOpportunities(): Promise<Opportunity[]> {
  return memoryOpportunities;
}

export async function toggleSaveOpportunityService(id: string): Promise<Opportunity | undefined> {
  const opp = memoryOpportunities.find(o => o.id === id);
  if (!opp) return undefined;

  opp.saved = !opp.saved;
  return opp;
}

export async function applyToOpportunityService(id: string): Promise<Opportunity | undefined> {
  const opp = memoryOpportunities.find(o => o.id === id);
  if (!opp) return undefined;

  opp.applied = true;
  return opp;
}
