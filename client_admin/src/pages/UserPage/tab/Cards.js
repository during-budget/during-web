import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAPI from "../../../hooks/useAPI";
import Table from "../../../components/Table";
import Detail from "../../../components/Detail";

function Index() {
  const navigate = useNavigate();
  const { _id } = useParams();
  const API = useAPI();

  const [cards, setCards] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const updateData = async () => {
    const { user } = await API.GET({ location: "users/" + _id });
    setCards(user.cards);
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
      <Table
        expandable={{
          expandedRowRender: Detail,
        }}
        columns={[
          {
            key: "_id",
            type: "button-copy",
            width: "112px",
          },

          {
            key: "icon",
            width: "112px",
          },
          {
            key: "title",
          },
          {
            key: "linkedAssetId",
            type: "button-copy",
            width: "124px",
          },
          { key: "linkedAssetIcon", width: "140px" },
          { key: "linkedAssetTitle", width: "140px" },
          {
            key: "detail",
            type: "expand-detail",
          },
        ]}
        rows={cards.map((card) => {
          return { ...card, key: card._id };
        })}
      />
    </div>
  ) : (
    <div>loading...</div>
  );
}

export default Index;
