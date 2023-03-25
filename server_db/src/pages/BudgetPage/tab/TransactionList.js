import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _ from "lodash";

import useAPI from "../../../hooks/useAPI";
import StickyTable from "../../../components/StickyTable";
import TransactionPopup from "../../../popups/Transaction";

function List({ isExpense = false, isIncome = false }) {
  const API = useAPI();
  const navigate = useNavigate();
  const { _id } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [transaction, setTransaction] = useState({});
  const [isDialogActive, setIsDialogActive] = useState(false);

  const updateDocuments = async () => {
    const { documents: transactions } = await API.GET({
      location: `test/transactions?budgetId=${_id}&isExpense=${isExpense}&isIncome=${isIncome}`,
    });

    const _transactions = [];
    for (let tr of transactions) {
      if (!tr.isCurrent) {
        _transactions.push({
          category: tr.category,
          scheduled: tr,
          current: {},
        });
      } else if (tr.linkId) {
        const _tr = _.find(
          _transactions,
          (elem) => elem["scheduled"]["_id"] === tr.linkId
        );
        console.log(_tr);
        if (_tr) _tr.current = tr;
      } else {
        _transactions.push({
          category: tr.category,
          scheduled: {},
          current: tr,
        });
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
                label: "category",
                type: "object",
                stringify: (obj) => `${obj.icon}/${obj.title}`,
              },
              {
                label: "scheduled.icon",
                onClick: (e) => {
                  if (e.scheduled?._id) {
                    setTransaction(e.scheduled);
                    setIsDialogActive(true);
                  }
                },
              },
              {
                label: "scheduled.title",
                type: "array-string",
                onClick: (e) => {
                  if (e.scheduled?._id) {
                    setTransaction(e.scheduled);
                    setIsDialogActive(true);
                  }
                },
              },
              {
                label: "scheduled.amount",
                onClick: (e) => {
                  if (e.scheduled?._id) {
                    setTransaction(e.scheduled);
                    setIsDialogActive(true);
                  }
                },
              },
              {
                label: "current.icon",
                onClick: (e) => {
                  if (e.current?._id) {
                    setTransaction(e.current);
                    setIsDialogActive(true);
                  }
                },
              },
              {
                label: "current.title",
                type: "array-string",
                onClick: (e) => {
                  if (e.current?._id) {
                    setTransaction(e.current);
                    setIsDialogActive(true);
                  }
                },
              },
              {
                label: "current.amount",
                onClick: (e) => {
                  if (e.current?._id) {
                    setTransaction(e.current);
                    setIsDialogActive(true);
                  }
                },
              },
              {
                label: "current.overAmount",
                onClick: (e) => {
                  if (e.current?._id) {
                    setTransaction(e.current);
                    setIsDialogActive(true);
                  }
                },
              },
            ]}
            rows={transactions}
          />
        </div>
      </div>
      <TransactionPopup
        open={isDialogActive}
        setOpen={setIsDialogActive}
        transaction={transaction}
      />
    </div>
  );
}

export default List;
