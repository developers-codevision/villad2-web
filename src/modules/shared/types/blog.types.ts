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

// ============================================
// BLOG COMMENT INTERFACES
// ============================================

export enum BlogCommentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface BlogComment {
  id: number;
  postId: number;
  postTitle?: string;
  name: string;
  content: string;
  response?: string;
  status: BlogCommentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogCommentDto {
  postId: number;
  name: string;
  content: string;
}

export interface UpdateBlogCommentDto {
  name?: string;
  content?: string;
  response?: string;
  status?: BlogCommentStatus;
}