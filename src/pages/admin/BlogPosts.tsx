
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/firebase';
import { 
  collection, 
  getDocs, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  views_count: number;
  published: boolean;
  published_at: { seconds: number; nanoseconds: number } | null;
  created_at: { seconds: number; nanoseconds: number };
}

export default function AdminBlogPosts() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: posts, isLoading } = useQuery<BlogPost[], Error>({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const postsCollection = collection(db, 'blog_posts');
      const q = query(postsCollection, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    }
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const postRef = doc(db, 'blog_posts', id);
      await updateDoc(postRef, {
        published: !published,
        published_at: !published ? serverTimestamp() : null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Post status updated');
    },
    onError: () => {
      toast.error('Failed to update post status');
    }
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const postRef = doc(db, 'blog_posts', id);
      await deleteDoc(postRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Post deleted');
    },
    onError: () => {
      toast.error('Failed to delete post');
    }
  });

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
            <p className="text-muted-foreground">Manage impact stories and articles</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
            <CardDescription>
              Impact stories, partner spotlights, and community updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading posts...</p>
            ) : filteredPosts?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No posts found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts?.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        {post.category && <Badge variant="outline">{post.category}</Badge>}
                      </TableCell>
                      <TableCell>{post.views_count?.toLocaleString() || 0}</TableCell>
                      <TableCell>
                        {post.published_at ? format(new Date(post.published_at.seconds * 1000), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.published ? 'default' : 'secondary'}>
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublished.mutate({ id: post.id, published: post.published })}
                          >
                            {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deletePost.mutate(post.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
