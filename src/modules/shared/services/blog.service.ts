// Blog Service - integrate with backend API
import { apiClient, authenticatedApiClient } from './api';
import { BlogPost, BlogPostStatus } from '../types/blog.types';

function mapApiBlogToPost(apiBlog: any): BlogPost {
  return {
    id: apiBlog.id,
    title: apiBlog.title,
    slug: apiBlog.slug,
    description: apiBlog.description,
    content: apiBlog.content,
    image: apiBlog.image,
    // API status: 'PUBLISHED' | 'HIDDEN' -> Frontend: 'VISIBLE' | 'HIDDEN'
    status:
      String(apiBlog.status).toUpperCase() === 'PUBLISHED'
        ? BlogPostStatus.VISIBLE
        : BlogPostStatus.HIDDEN,
    publishedAt: apiBlog.publishedAt ? new Date(apiBlog.publishedAt).toISOString() : undefined,
    createdAt: apiBlog.createdAt ? new Date(apiBlog.createdAt).toISOString() : undefined,
    updatedAt: apiBlog.updatedAt ? new Date(apiBlog.updatedAt).toISOString() : undefined,
  } as BlogPost;
}

function mapStatusFrontendToApi(status?: BlogPostStatus | string) {
  // Frontend uses VISIBLE/HIDDEN; API uses PUBLISHED/HIDDEN
  if (!status) return undefined;
  const s = String(status).toUpperCase();
  if (s === 'VISIBLE' || s === 'PUBLISHED') return 'PUBLISHED';
  return 'HIDDEN';
}

export const blogService = {
  // Return all posts (array) to keep compatibility with existing callers
  async getAll(status?: BlogPostStatus): Promise<BlogPost[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', mapStatusFrontendToApi(status)!);
    // request a large limit to retrieve all items for admin UI (small dataset expected)
    params.append('page', '1');
    params.append('limit', '1000');

    const res = await apiClient.get<{ blogs: any[] }>(`/blog?${params.toString()}`);
    return res.blogs.map(mapApiBlogToPost);
  },

  async getVisible(): Promise<BlogPost[]> {
    return this.getAll(BlogPostStatus.VISIBLE);
  },

  async getByIdOrSlug(idOrSlug: string): Promise<BlogPost> {
    // If numeric, fetch by id
    const isNumeric = /^[0-9]+$/.test(idOrSlug);
    let apiRes: any;
    if (isNumeric) {
      apiRes = await apiClient.get<any>(`/blog/${idOrSlug}`);
    } else {
      apiRes = await apiClient.get<any>(`/blog/slug/${encodeURIComponent(idOrSlug)}`);
    }
    return mapApiBlogToPost(apiRes);
  },

  // Admin methods (use authenticated client)
  async create(formData: FormData): Promise<BlogPost> {
    // Normalize FormData: map frontend status (VISIBLE/HIDDEN) to API status (PUBLISHED/HIDDEN)
    const normalized = new FormData();
    for (const [key, value] of Array.from(formData.entries())) {
      if (key === 'status' && typeof value === 'string') {
        const mapped = mapStatusFrontendToApi(value as BlogPostStatus) || value;
        normalized.append('status', mapped);
      } else {
        // value can be File or string
        normalized.append(key, value as any);
      }
    }

    const res = await authenticatedApiClient.postFormData<any>('/blog', normalized);
    return mapApiBlogToPost(res);
  },

  async update(id: number, formData: FormData): Promise<BlogPost> {
    const normalized = new FormData();
    for (const [key, value] of Array.from(formData.entries())) {
      if (key === 'status' && typeof value === 'string') {
        const mapped = mapStatusFrontendToApi(value as BlogPostStatus) || value;
        normalized.append('status', mapped);
      } else {
        normalized.append(key, value as any);
      }
    }

    const res = await authenticatedApiClient.patchFormData<any>(`/blog/${id}`, normalized);
    return mapApiBlogToPost(res);
  },

  async changeStatus(id: number, status: BlogPostStatus): Promise<BlogPost> {
    // map frontend status to API
    const apiStatus = mapStatusFrontendToApi(status);
    const res = await authenticatedApiClient.patch<any>(`/blog/${id}/status`, { status: apiStatus });
    return mapApiBlogToPost(res);
  },

  async delete(id: number): Promise<void> {
    await authenticatedApiClient.delete<void>(`/blog/${id}`);
  },
};
