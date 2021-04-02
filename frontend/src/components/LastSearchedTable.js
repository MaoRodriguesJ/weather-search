import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Moment from "moment";
import React from "react";

export default function LastSearchedTable(props) {
  const { rows, rowsPerPage, setRowsPerPage, page, setPage, count } = props;

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>Zipcode</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Temperature</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Last Searched</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.city}
              </TableCell>
              <TableCell>{row.zipcode}</TableCell>
              <TableCell>{row.country_code}</TableCell>
              <TableCell>{row.temperature + " º F"}</TableCell>
              <TableCell>
                {Moment(row.last_updated).format("MMMM DD, YYYY hh:mm")}
              </TableCell>
              <TableCell>
                {Moment(row.last_searched).format("MMMM DD, YYYY hh:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Table>
    </TableContainer>
  );
}
