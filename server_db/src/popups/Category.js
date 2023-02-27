import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";

export default function TransactionPopup({ open, setOpen, category }) {
  return (
    (category._id || category.categoryId) && (
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        scroll="paper"
        fullWidth
        maxWidth={false}
      >
        <DialogTitle>Category Info</DialogTitle>
        <DialogContent dividers>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {Object.keys(category).map((key, idx) => (
              <TextField
                id={`dialog-input-${key}-${idx}`}
                label={key}
                defaultValue={category[key]}
                InputProps={{
                  readOnly: true,
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
