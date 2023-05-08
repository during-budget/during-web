import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import useStore from "../../hooks/useStore";

function Redirect() {
  const { logIn, logOut } = useStore((state) => state);
  const API = useAPI();
  const navigate = useNavigate();

  const update = async () => {
    try {
      const { user } = await API.GET({ location: "users/current" });
      if (user) {
        logIn(user);
        navigate("/");
      }
    } catch (err) {
      logOut();
      console.error(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    update();
    return () => {};
  }, []);

  return <div />;
}

export default Redirect;
