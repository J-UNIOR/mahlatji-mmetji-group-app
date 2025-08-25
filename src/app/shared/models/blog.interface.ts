export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  publishedDate: Date;
  updatedDate?: Date;
  featuredImage?: string;
  tags: string[];
  categories: string[];
  status: 'draft' | 'published' | 'archived';
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogFilter {
  categories?: string[];
  tags?: string[];
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  featured?: boolean;
  search?: string;
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogResponse {
  posts: BlogPost[];
  pagination: BlogPagination;
}
