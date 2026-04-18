export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content: string;
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
  title: string;
  slug: string;
  description?: string;
  content: string;
  image?: string;
  status: BlogPostStatus;
  publishedAt: string;
}

export interface UpdateBlogPostDto {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  image?: string;
  status?: BlogPostStatus;
  publishedAt?: string;
}