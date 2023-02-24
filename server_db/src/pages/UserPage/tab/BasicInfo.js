import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@material-ui/core";

import useAPI from "../../../hooks/useAPI";

function Index() {
  const API = useAPI();
  const { _id } = useParams();
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const updateData = async () => {
    const { document } = await API.GET({ location: "test/users/" + _id });
    setUser(document);
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
    <div>
      <div>
        <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
          {Object.keys(user).map((key, idx) => (
            <TextField
              id={`outlined-read-only-input-${idx}`}
              label={key}
              defaultValue={user[key]}
              InputProps={{
                readOnly: true,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default Index;
