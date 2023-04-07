import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

import useAPI from "../../../hooks/useAPI";
import StickyTable from "../../../components/StickyTable";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@mui/material";
import DocPopup from "../../../popups/Document";

function List() {
  const API = useAPI();
  const navigate = useNavigate();
  const { _id } = useParams();

  const [assets, setAssets] = useState([]);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [doc, setDoc] = useState({});
  const [docPopupOpen, setDocPopupOpen] = useState(false);

  const updateDocuments = async () => {
    const { document } = await API.GET({ location: "test/users/" + _id });
    setAssets(document.assets ?? []);
    setCards(document.cards ?? []);
  };

  useEffect(() => {
    if (isLoading && _id) {
      updateDocuments().then(() => {
        setIsLoading(false);
      });
    }
    return () => {};
  }, [isLoading]);

  return (
    <div>
      <div>
        {" "}
        <h3>Assets</h3>
        <StickyTable
          onClick={(e) => {
            setDoc(e);
            setDocPopupOpen(true);
          }}
          columns={[
            {
              label: "_id",
              type: "button-copy",
              width: "112px",
            },
            {
              label: "icon",
            },
            {
              label: "title",
            },
            {
              label: "amount",
            },
          ]}
          rows={assets}
        />
      </div>
      <div style={{ marginTop: "24px" }}>
        {" "}
        <h3>Cards</h3>
        <StickyTable
          onClick={(e) => {
            setDoc(e);
            setDocPopupOpen(true);
          }}
          columns={[
            {
              label: "_id",
              type: "button-copy",
              width: "112px",
            },
            {
              label: "linkedAssetId",
              type: "button-copy",
              width: "112px",
            },
            { label: "linkedAssetIcon" },
            { label: "linkedAssetTitle" },
            {
              label: "icon",
            },
            {
              label: "title",
            },
          ]}
          rows={cards}
        />
      </div>
      <DocPopup open={docPopupOpen} setOpen={setDocPopupOpen} doc={doc} />
    </div>
  );
}

export default List;
