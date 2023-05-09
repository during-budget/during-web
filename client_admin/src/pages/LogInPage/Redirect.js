import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useAPI";
import useStore from "../../hooks/useStore";
import useQueries from "../../hooks/useQueries";

function Redirect() {
  const { logIn, logOut } = useStore((state) => state);
  const API = useAPI();
  const navigate = useNavigate();
  const query = new useQueries();

  const update = async () => {
    try {
      const { user } = await API.GET({ location: "users/current" });
      if (user) {
        if (query.isNew) {
          alert("회원가입 성공");
        }
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
