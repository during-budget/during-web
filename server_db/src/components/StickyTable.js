import { useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, Snackbar } from "@material-ui/core";
import { Alert } from "@mui/material";
import _ from "lodash";

export async function copyClipBoard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return text;
  } catch (error) {
    return error;
  }
}

export default function StickyHeadTable({ columns, rows, onClick }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const snackbarLabelRef = useRef("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column._id}
                  align={column.align ?? "center"}
                  style={{
                    width: column.width,
                    fontWeight: "600",
                    backgroundColor: "black",
                    color: "white",
                    border: "1px white solid",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  {columns.map((column) => {
                    const value = row[column.label];

                    if (column.type === "button-delete") {
                      return (
                        <TableCell
                          key={column._id}
                          align={column.align ?? "center"}
                        >
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              column.onClick && column.onClick(row);
                            }}
                          >
                            {"❌"}
                          </Button>
                        </TableCell>
                      );
                    }
                    if (column.type === "button-copy") {
                      return (
                        <TableCell
                          key={column._id}
                          align={column.align ?? "center"}
                        >
                          <Button
                            variant="contained"
                            onClick={() => {
                              copyClipBoard(row[column.label]).then((text) => {
                                snackbarLabelRef.current = `copied! => ${text}`;
                                setShowSnackbar(true);
                                setTimeout(() => setShowSnackbar(false), 1000);
                              });
                            }}
                          >
                            {"🗗"}
                          </Button>
                          <Snackbar
                            open={showSnackbar}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                          >
                            <Alert oseverity="success" sx={{ width: "100%" }}>
                              {snackbarLabelRef.current}
                            </Alert>
                          </Snackbar>
                        </TableCell>
                      );
                    }
                    if (column.type === "array-string") {
                      return (
                        <TableCell
                          key={column._id}
                          align={column.align ?? "center"}
                          onClick={() =>
                            column.onClick
                              ? column.onClick(row)
                              : onClick
                              ? onClick(row)
                              : undefined
                          }
                          style={{
                            cursor:
                              column.onClick || onClick ? "pointer" : "default",
                          }}
                        >
                          {_.join(value, "/")}
                        </TableCell>
                      );
                    }
                    if (column.type === "boolean") {
                      return (
                        <TableCell
                          key={column._id}
                          align={column.align ?? "center"}
                          onClick={() =>
                            column.onClick
                              ? column.onClick(row)
                              : onClick
                              ? onClick(row)
                              : undefined
                          }
                          style={{
                            cursor:
                              column.onClick || onClick ? "pointer" : "default",
                            color: value ? "blue" : "red",
                          }}
                        >
                          {value ? "Y" : "N"}
                        </TableCell>
                      );
                    }
                    if (column.type === "object") {
                      return (
                        <TableCell
                          key={column._id}
                          align={column.align ?? "center"}
                          onClick={() =>
                            column.onClick
                              ? column.onClick(row)
                              : onClick
                              ? onClick(row)
                              : undefined
                          }
                          style={{
                            cursor:
                              column.onClick || onClick ? "pointer" : "default",
                          }}
                        >
                          {column.stringify(value)}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={column._id}
                        align={column.align ?? "center"}
                        onClick={() =>
                          column.onClick
                            ? column.onClick(row)
                            : onClick
                            ? onClick(row)
                            : undefined
                        }
                        style={{
                          cursor:
                            column.onClick || onClick ? "pointer" : "default",
                        }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
