import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

import useAPI from "../../../hooks/useAPI";
import StickyTable from "../../../components/StickyTable";

function List({ isExpense = false, isIncome = false }) {
  const API = useAPI();
  const navigate = useNavigate();
  const { _id } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateDocuments = async () => {
    const { documents: transactions } = await API.GET({
      location: `test/transactions?budgetId=${_id}&isExpense=${isExpense}&isIncome=${isIncome}`,
    });

    const _transactions = [];
    for (let tr of transactions) {
      if (!tr.isCurrent) {
        tr.type = "scheduled";
        _transactions.push(tr);
      } else if (tr.linkId) {
        tr.type = "↳current";
        const idx = _.findIndex(_transactions, { _id: tr.linkId });
        if (idx !== -1) {
          _transactions.splice(idx + 1, 0, tr);
        }
      } else {
        tr.type = "current";
        _transactions.push(tr);
      }
    }
    setTransactions(_transactions);
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
        <div>
          <StickyTable
            onClick={(e) => {
              navigate(e._id);
            }}
            columns={[
              {
                label: "_id",
                type: "button-copy",
                width: "112px",
              },
              {
                label: "date",
              },
              {
                label: "type",
              },
              {
                label: "category",
                type: "object",
                stringify: (obj) => `${obj.icon}/${obj.title}`,
              },
              {
                label: "title",
                type: "array-string",
              },
              {
                label: "amount",
              },
              {
                label: "tags",
                type: "array-string",
              },
              {
                label: "memo",
              },
            ]}
            rows={transactions}
          />
        </div>
      </div>
    </div>
  );
}

export default List;
