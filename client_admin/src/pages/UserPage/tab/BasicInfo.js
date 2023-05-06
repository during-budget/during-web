import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";

import Detail from "../../../components/Detail";
import Loading from "../../../components/Loading";

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
    Detail(user, { marginLeft: "0px", marginRight: "0px" })
  ) : (
    <Loading />
  );
}

export default Index;
