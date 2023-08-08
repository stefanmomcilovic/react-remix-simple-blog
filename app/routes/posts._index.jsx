import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser } from '~/utils/session.server';
export const loader = async ({ request }) => {
  const user = await getUser(request);

  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { 
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { 
        createdAt: "desc" 
      }
    })
  };
  return { data, user};
};

function Posts() {
  const { data, user } = useLoaderData();
  const posts = data.posts;
  return (
    <>
      <div className="page-header">
        <h1>Remix Blog</h1>
        {user && (
          <Link to="/posts/new" className="btn">
            New Post
          </Link>
          )}
      </div>
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleDateString("en-US", {})}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </>
  );
}

export default Posts;