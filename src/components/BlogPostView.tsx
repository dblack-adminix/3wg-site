import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Tag as TagIcon, User, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, calculateReadingTime } from '@/lib/blog-utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  published: boolean;
  featured_image?: string;
  created_at: string;
  updated_at: string;
  views: number;
}

interface BlogPostViewProps {
  post: BlogPost;
}

export const BlogPostView = ({ post }: BlogPostViewProps) => {
  const readingTime = calculateReadingTime(post.content);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[400px] mb-8 rounded-2xl overflow-hidden">
        {/* Background Image */}
        {post.featured_image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.featured_image})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {post.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} мин чтения</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views} просмотров</span>
              </div>
            </div>
            
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-white/90 max-w-3xl leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </motion.div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Поделиться
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="prose prose-lg max-w-none dark:prose-invert"
      >
        {/* Render HTML content from WYSIWYG editor */}
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="leading-relaxed"
        />
      </motion.div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 pt-8 border-t border-border"
      >
        {/* All Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TagIcon className="w-5 h-5" />
            Теги статьи
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Meta */}
        <div className="mt-8 text-sm text-muted-foreground space-y-2">
          <p>Опубликовано: {formatDate(post.created_at)}</p>
          {post.updated_at !== post.created_at && (
            <p>Обновлено: {formatDate(post.updated_at)}</p>
          )}
          <p>Просмотров: {post.views}</p>
        </div>
      </motion.div>
    </article>
  );
};