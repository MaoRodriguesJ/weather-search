import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { useEffect, useState } from "react";
import LastSearchedTable from "./LastSearchedTable";

export default function LastSearched(props) {
  const { weather } = props;
  const [weathers, setWeathers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSearches, setTotalSearches] = useState(0);

  useEffect(() => {
    axios
      .get(`api/weathers/?page=${page}&size=${rowsPerPage}`)
      .then((res) => {
        setTotalSearches(res.data.total);
        setWeathers(res.data.items);
      })
      .catch((err) => console.error(err));
  }, [weather, page, rowsPerPage]);

  return (
    <div className="px-5 w-11/12">
      <Typography variant="h6" className="pb-1">
        Last Searched
      </Typography>
      {weathers?.length > 0 ? (
        <LastSearchedTable
          rows={weathers}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={totalSearches}
        />
      ) : (
        <div className="text-lg font-light italic">
          Last searches will appear here
        </div>
      )}
    </div>
  );
}
