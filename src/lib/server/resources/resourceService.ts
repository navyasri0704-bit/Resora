import { Resource } from '@/types';
import { MOCK_RESOURCES } from '@/lib/mockData';

let memoryResources: Resource[] = [...MOCK_RESOURCES];

export async function getAllResources(): Promise<Resource[]> {
  return memoryResources;
}

export async function getResourceById(id: string): Promise<Resource | undefined> {
  return memoryResources.find(r => r.id === id);
}

export async function createResource(newRes: Omit<Resource, 'id'> & { id?: string }): Promise<Resource> {
  const resource: Resource = {
    ...newRes,
    id: newRes.id || `res_${Date.now()}`,
    resourceCode: newRes.resourceCode || `RES-${Math.floor(1000 + Math.random() * 9000)}`,
    status: newRes.status || 'AVAILABLE',
    features: newRes.features || [],
  };
  memoryResources = [resource, ...memoryResources];
  return resource;
}

export async function updateResource(id: string, updates: Partial<Resource>): Promise<Resource | undefined> {
  const index = memoryResources.findIndex(r => r.id === id);
  if (index === -1) return undefined;

  memoryResources[index] = {
    ...memoryResources[index],
    ...updates,
  };
  return memoryResources[index];
}

export async function setResourceStatus(id: string, status: Resource['status']): Promise<Resource | undefined> {
  return updateResource(id, { status });
}
