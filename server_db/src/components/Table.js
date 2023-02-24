// reference: https://htkim298.medium.com/우린-이런-멋진-테이블을-만들기-위해-material-ui-이란-라이브러리를-사용하여-간편하게-만들-예정이에요-3dc24cac033

import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 240,
  },
});

export async function copyClipBoard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return text;
  } catch (error) {
    return error;
  }
}

export default function CustomizedTables({ header, data }) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {header.map((val) => (
              <StyledTableCell align="center">{val.text}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <StyledTableRow key={row._id}>
              {header.map((val) => {
                if (val.type === "button") {
                  return (
                    <StyledTableCell align="center" width={val.width}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          val.onClick && val.onClick(row);
                        }}
                      >
                        {val.text}
                      </Button>
                    </StyledTableCell>
                  );
                }
                if (val.type === "button-copy") {
                  return (
                    <StyledTableCell align="center" width={val.width}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          copyClipBoard(row[val.text]).then((text) => {
                            alert(`copied => ${text}`);
                          });
                        }}
                      >
                        {"🗗"}
                      </Button>
                    </StyledTableCell>
                  );
                }
                return (
                  <StyledTableCell align="center" width={val.width}>
                    {row[val.text]}
                  </StyledTableCell>
                );
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
