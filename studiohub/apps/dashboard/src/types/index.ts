export type Project = {
  id: string;
  owner_id: string;
  org_id?: string | null;
  name: string;
  description: string | null;
  status: 'active' | 'paused' | 'completed';
  client_name: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  tags: string[];
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectFormData = Omit<Project, 'id' | 'owner_id' | 'created_at' | 'updated_at'>;

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};
