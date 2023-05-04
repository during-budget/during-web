import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";

import Input from "../../../components/Input";

function Index() {
  const API = useAPI();
  const { _id } = useParams();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const updateData = async () => {
    const { user } = await API.GET({ location: "users/" + _id });
    setUser(user);
  };

  useEffect(() => {
    if (isLoading) {
      updateData()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          alert(err.response.data.message);
          return navigate("/users");
        });
    }
    return () => {};
  }, [isLoading]);

  return !isLoading ? (
    <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
      {Object.keys(user).map((key, idx) => (
        <Input label={key} value={user[key]} disable />
      ))}
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default Index;
