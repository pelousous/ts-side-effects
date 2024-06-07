import { useEffect, useState } from "react";
import fetchingImage from "./assets/data-fetching.png";
import BlogPosts, { BlogPost } from "./components/BlogPosts";
import { get } from "./util/http";
import { z } from "zod";
import ErrorMessage from "./components/ErrorMessage";

type RawDataBlogPost = {
  id: number;
  title: string;
  body: string;
};

const rawDataBlogPostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectedPostsSchema = z.array(rawDataBlogPostSchema);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsFetching(true);
        const data = await get("https://jsonplaceholder.typicode.com/posts");
        const parsedData = expectedPostsSchema.parse(data);
        const blogPosts = parsedData.map((post: RawDataBlogPost) => {
          return {
            id: post.id,
            title: post.title,
            text: post.body,
          };
        });

        setFetchedPosts(blogPosts);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }

      setIsFetching(false);
    };

    fetchPosts();
  });

  let content: React.ReactNode = null;

  if (isFetching) {
    content = <img src={fetchingImage} alt="Fetching data" />;
  }

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  }

  return (
    <main>
      <img src={fetchingImage} alt="Fetching data" />
      {content}
    </main>
  );
}

export default App;
