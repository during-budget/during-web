import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";

export default function TransactionPopup({ open, setOpen, transaction }) {
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
              {Object.keys(transaction)
                .filter((key) => !key.includes("linked"))
                .map((key, idx) => (
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
              {Object.keys(transaction)
                .filter((key) => key.includes("linked"))
                .map((key, idx) => (
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
