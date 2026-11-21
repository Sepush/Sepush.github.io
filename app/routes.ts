import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('posts', 'routes/posts.tsx'),
  route('posts/*', 'routes/post.tsx'),
  route('notes', 'routes/notes.tsx'),
  route('notes/:slug', 'routes/note.tsx'),
  route('about', 'routes/about.tsx'),
  route('friends', 'routes/friends.tsx'),
  route('404', 'routes/not-found.tsx'),
  route('*', 'routes/not-found.tsx', { id: 'catch-all' }),
] satisfies RouteConfig;
