export interface BlogPost {
  id: number;
  title_es: string;
  title_en?: string;
  slug_es: string;
  slug_en?: string;
  description_es?: string;
  description_en?: string;
  content_es: string;
  content_en?: string;
  image?: string;
  status: BlogPostStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export enum BlogPostStatus {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
}

export interface CreateBlogPostDto {
  title_es: string;
  title_en?: string;
  slug_es: string;
  slug_en?: string;
  description_es?: string;
  description_en?: string;
  content_es: string;
  content_en?: string;
  image?: string;
  status: BlogPostStatus;
  publishedAt: string;
}

export interface UpdateBlogPostDto {
  title_es?: string;
  title_en?: string;
  slug_es?: string;
  slug_en?: string;
  description_es?: string;
  description_en?: string;
  content_es?: string;
  content_en?: string;
  image?: string;
  status?: BlogPostStatus;
  publishedAt?: string;
}