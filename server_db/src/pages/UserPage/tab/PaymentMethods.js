import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

import useAPI from "../../../hooks/useAPI";
import StickyTable from "../../../components/StickyTable";
import DocPopup from "../../../popups/Document";

function List() {
  const API = useAPI();
  const { _id } = useParams();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [doc, setDoc] = useState({});
  const [docPopupOpen, setDocPopupOpen] = useState(false);

  const updateDocuments = async () => {
    const { document } = await API.GET({ location: "test/users/" + _id });
    setPaymentMethods(document.paymentMethods ?? []);
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
        <h3>Payment methods</h3>
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
              label: "type",
            },
            {
              label: "icon",
            },
            {
              label: "title",
            },
            {
              label: "detail",
            },
          ]}
          rows={paymentMethods}
        />
      </div>

      <DocPopup open={docPopupOpen} setOpen={setDocPopupOpen} doc={doc} />
    </div>
  );
}

export default List;
