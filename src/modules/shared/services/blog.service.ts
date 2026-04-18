// Blog Local Service - Works with local JSON files in public folder

import {
  BlogPost,
  BlogPostStatus,
} from '../types/blog.types';

const STORAGE_KEY = 'villad2_blog_posts';

let cachedPosts: BlogPost[] | null = null;

async function loadInitialPosts(): Promise<BlogPost[]> {
  if (cachedPosts) return cachedPosts;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    cachedPosts = JSON.parse(stored);
    return cachedPosts;
  }

  try {
    const response = await fetch('/blog-posts.json');
    if (response.ok) {
      cachedPosts = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedPosts));
    }
  } catch {
    cachedPosts = [];
  }
  
  return cachedPosts || [];
}

function getStoredPosts(): BlogPost[] {
  return cachedPosts || [];
}

function savePosts(posts: BlogPost[]): void {
  cachedPosts = posts;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function generateId(): number {
  const posts = getStoredPosts();
  return posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
}

export const blogService = {
  /**
   * Get all blog posts with optional filters
   */
  async getAll(status?: BlogPostStatus): Promise<BlogPost[]> {
    const posts = await loadInitialPosts();
    if (status) {
      return posts.filter(p => p.status === status);
    }
    return posts;
  },

  /**
   * Get visible blog posts only (for client)
   */
  async getVisible(): Promise<BlogPost[]> {
    const posts = await loadInitialPosts();
    return posts.filter(p => p.status === BlogPostStatus.VISIBLE);
  },

  /**
   * Get a blog post by ID or slug
   */
  async getByIdOrSlug(idOrSlug: string): Promise<BlogPost> {
    const posts = await loadInitialPosts();
    const post = posts.find(p => p.id.toString() === idOrSlug || p.slug === idOrSlug);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  },

  /**
   * Create a new blog post (admin only)
   */
  async create(dto: FormData): Promise<BlogPost> {
    const posts = await loadInitialPosts();
    const title = dto.get('title') as string;
    const slug = dto.get('slug') as string;
    const content = dto.get('content') as string;
    const status = dto.get('status') as BlogPostStatus;
    const publishedAt = dto.get('publishedAt') as string;

    const newPost: BlogPost = {
      id: generateId(),
      title,
      slug,
      content,
      status,
      publishedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    posts.push(newPost);
    savePosts(posts);
    return newPost;
  },

  /**
   * Update a blog post (admin only)
   */
  async update(id: number, dto: FormData): Promise<BlogPost> {
    const posts = await loadInitialPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }

    const updatedPost: BlogPost = {
      ...posts[index],
      title: dto.get('title') as string || posts[index].title,
      slug: dto.get('slug') as string || posts[index].slug,
      content: dto.get('content') as string || posts[index].content,
      status: (dto.get('status') as BlogPostStatus) || posts[index].status,
      publishedAt: dto.get('publishedAt') as string || posts[index].publishedAt,
      updatedAt: new Date().toISOString(),
    };

    posts[index] = updatedPost;
    savePosts(posts);
    return updatedPost;
  },

  /**
   * Change blog post status (admin only)
   */
  async changeStatus(id: number, status: BlogPostStatus): Promise<BlogPost> {
    const posts = await loadInitialPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }

    posts[index].status = status;
    posts[index].updatedAt = new Date().toISOString();
    savePosts(posts);
    return posts[index];
  },

  /**
   * Delete a blog post (admin only)
   */
  async delete(id: number): Promise<void> {
    const posts = await loadInitialPosts();
    const filtered = posts.filter(p => p.id !== id);
    savePosts(filtered);
  },
};