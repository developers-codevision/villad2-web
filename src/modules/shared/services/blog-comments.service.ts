import { apiClient, authenticatedApiClient } from './api';
import {
  BlogComment,
  BlogCommentStatus,
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from '../types/blog.types';

function mapApiCommentToBlogComment(apiComment: any): BlogComment {
  return {
    id: apiComment.id,
    postId: apiComment.postId,
    postTitle: apiComment.postTitle || apiComment.post?.titleEs || '',
    name: apiComment.name,
    content: apiComment.content,
    response: apiComment.response,
    status: apiComment.status as BlogCommentStatus,
    createdAt: apiComment.createdAt ? new Date(apiComment.createdAt).toISOString() : '',
    updatedAt: apiComment.updatedAt ? new Date(apiComment.updatedAt).toISOString() : '',
  };
}

export const blogCommentsService = {
  async getByPostId(
    postId: number,
    status?: BlogCommentStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    comments: BlogComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams();
    params.append('postId', postId.toString());
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const client = status === BlogCommentStatus.ACTIVE ? apiClient : authenticatedApiClient;

    const res = await client.get<{
      comments: any[];
      total: number;
      page: number;
      limit: number;
    }>(`/blog-comments?${params.toString()}`);

    return {
      comments: res.comments.map(mapApiCommentToBlogComment),
      total: res.total,
      page: res.page,
      limit: res.limit,
    };
  },

  async getAll(
    status?: BlogCommentStatus,
    postId?: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    comments: BlogComment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (postId) params.append('postId', postId.toString());
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return authenticatedApiClient.get<{
      comments: any[];
      total: number;
      page: number;
      limit: number;
    }>(`/blog-comments?${params.toString()}`).then((res) => ({
      comments: res.comments.map(mapApiCommentToBlogComment),
      total: res.total,
      page: res.page,
      limit: res.limit,
    }));
  },

  async getById(id: number): Promise<BlogComment> {
    const res = await authenticatedApiClient.get<any>(`/blog-comments/${id}`);
    return mapApiCommentToBlogComment(res);
  },

  async create(dto: CreateBlogCommentDto): Promise<BlogComment> {
    const res = await apiClient.post<any>('/blog-comments', dto);
    return mapApiCommentToBlogComment(res);
  },

  async update(id: number, dto: UpdateBlogCommentDto): Promise<BlogComment> {
    const res = await authenticatedApiClient.patch<any>(`/blog-comments/${id}`, dto);
    return mapApiCommentToBlogComment(res);
  },

  async changeStatus(id: number, status: BlogCommentStatus): Promise<BlogComment> {
    const res = await authenticatedApiClient.patch<any>(`/blog-comments/${id}/status`, {
      status,
    });
    return mapApiCommentToBlogComment(res);
  },

  async addResponse(id: number, response: string): Promise<BlogComment> {
    const res = await authenticatedApiClient.patch<any>(`/blog-comments/${id}/response`, {
      response,
    });
    return mapApiCommentToBlogComment(res);
  },

  async deleteResponse(id: number): Promise<BlogComment> {
    const res = await authenticatedApiClient.patch<any>(`/blog-comments/${id}/response`, {
      response: null,
    });
    return mapApiCommentToBlogComment(res);
  },

  async delete(id: number): Promise<void> {
    await authenticatedApiClient.delete<void>(`/blog-comments/${id}`);
  },
};