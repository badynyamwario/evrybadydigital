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

export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'facebook';

export type HookAngle = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational' | 'controversial';

export interface HookFormData {
  platform: SocialPlatform | '';
  topic: string;
  audience: string;
  angle: HookAngle | '';
  keywords: string;
}

export interface HookResult {
  hook: string;
  platform: SocialPlatform;
  angle: HookAngle;
  why: string;
}

export type ToastType = 'info' | 'success' | 'error';

export type Toast = { 
  id: string; 
  message: string; 
  type: ToastType; 
};