import type { SectionRecord } from '@/services/sectionService';

export type Business = { 
  id: string; 
  name: string; 
  owner_id: string; 
};

export type SectionFormState = Partial<SectionRecord> & { 
  metadata: Record<string, unknown>; 
};

export type FooterLink = { 
  label: string; 
  href: string; 
};

export type ToastType = 'info' | 'success' | 'error';

export type Toast = { 
  id: string; 
  message: string; 
  type: ToastType; 
};