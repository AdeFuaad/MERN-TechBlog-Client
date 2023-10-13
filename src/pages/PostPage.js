import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  if (!postInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time style={{ marginTop: "20px" }}>
        {format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}
      </time>
      <div className="author">by User</div>
      {/* {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <a href="" className="edit-btn">
            Edit this post
          </a>
        </div>
      )} */}
      <div className="image" style={{ marginTop: "20px" }}>
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>
      <div
        style={{ marginTop: "30px" }}
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      ></div>
    </div>
  );
}
