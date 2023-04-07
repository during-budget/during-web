import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";

export default function AssetPopup({ open, setOpen, doc }) {
  return (
    doc._id && (
      <Dialog onClose={() => setOpen(false)} open={open} scroll="paper">
        <DialogTitle>Document Info</DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                display: "flex",
                gap: "24px",
                flexDirection: "column",
              }}
            >
              {Object.keys(doc).map((key, idx) => (
                <TextField
                  id={`dialog-input-${key}-${idx}`}
                  label={key}
                  defaultValue={doc[key]}
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
