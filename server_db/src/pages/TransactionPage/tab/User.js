import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";

function User() {
  const API = useAPI();
  const { _id } = useParams();
  const navigate = useNavigate();

  const findUserId = async () => {
    const { document } = await API.GET({
      location: "test/transactions/" + _id,
    });
    return document.userId;
  };

  useEffect(() => {
    findUserId()
      .then((userId) => {
        navigate(`/users/${userId}`);
      })
      .catch((err) => {
        alert(err.response.data.message);
        return navigate("/transactions");
      });
    return () => {};
  }, []);

  return <div>loading...</div>;
}

export default User;
