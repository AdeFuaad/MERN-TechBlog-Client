import Post from "../components/Post";
import React, { useEffect, useState } from "react";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://mern-tech-api.vercel.app/post")
      .then((response) => response.json())
      .then((data) => {
        console.log("Received posts: ", data);
        setPosts(data);
      })
      .catch((error) => {
        console.log("Error fetching posts: ", error);
      });
  }, []);

  return (
    <div>
      {posts.length > 0 &&
        posts.map((post) => {
          return <Post key={post._id} {...post} />;
        })}
    </div>
  );
}

// <div>
//   {posts.length > 0 &&
//     posts.map(({ _id, title, summary, content, cover }) => {
//       console.log("Rendering post with id:", _id);
//       return (
//         <Post
//           key={_id}
//           _id={_id}
//           title={title}
//           summary={summary}
//           content={content}
//           cover={cover}
//         />
//       );
//     })}
// </div>
