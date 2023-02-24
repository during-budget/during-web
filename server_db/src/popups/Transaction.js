import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";

export default function TransactionPopup({ open, setOpen, transaction }) {
  const navigate = useNavigate();

  return (
    transaction._id && (
      <Dialog onClose={() => setOpen(false)} open={open} scroll="paper">
        <DialogTitle>Transaction Info</DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                display: "flex",
                gap: "24px",
                flexDirection: "column",
              }}
            >
              <TextField
                id={`dialog-input-${"_id"}-${0}`}
                label={"_id"}
                defaultValue={transaction["_id"]}
                InputProps={{
                  readOnly: true,
                }}
              />
              <div style={{ display: "flex", gap: "2px" }}>
                <TextField
                  id={`dialog-input-${"budgetId"}-${1}`}
                  label={"budgetId"}
                  defaultValue={transaction["budgetId"]}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate(`/budgets/${transaction.budgetId}`);
                  }}
                  size="small"
                >
                  {"↗"}
                </Button>
              </div>
              <div style={{ display: "flex", gap: "2px" }}>
                <TextField
                  id={`dialog-input-${"userId"}-${1}`}
                  label={"userId"}
                  defaultValue={transaction["userId"]}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate(`/users/${transaction.userId}`);
                  }}
                  size="small"
                >
                  {"↗"}
                </Button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "24px",
                flexDirection: "column",
              }}
            >
              {Object.keys(transaction.category).map((key, idx) => (
                <TextField
                  id={`dialog-input-${key}-${idx}`}
                  label={`category.${key}`}
                  defaultValue={transaction.category[key]}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "24px",
                flexDirection: "column",
              }}
            >
              {["title", "date", "amount", "isCurrent"].map((key, idx) => (
                <TextField
                  id={`dialog-input-${key}-${idx}`}
                  label={key}
                  defaultValue={transaction[key]}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "24px",
                flexDirection: "column",
              }}
            >
              {["tags", "memo"].map((key, idx) => (
                <TextField
                  id={`dialog-input-${key}-${idx}`}
                  label={key}
                  defaultValue={transaction[key]}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
