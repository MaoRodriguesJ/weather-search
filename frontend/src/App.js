import AppBar from "@material-ui/core/AppBar";
import Snackbar from "@material-ui/core/Snackbar";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MuiAlert from "@material-ui/lab/Alert";
import { createContext, useState } from "react";
import CurrentWeather from "./components/CurrentWeather";
import LastSearched from "./components/LastSearched";
import SearchLocation from "./components/SearchLocation";

export const SnackbarContext = createContext({});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    color: "black",
  },
  background: {
    backgroundColor: "white",
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#339999",
      main: "#008080",
      dark: "#005959",
      contrastText: "#fff",
    },
    secondary: {
      light: "#834bff",
      main: "#651fff",
      dark: "#4615b2",
      contrastText: "#fff",
    },
  },
});

export default function App() {
  const classes = useStyles();
  const [currentWeather, setCurrentWeather] = useState();
  const [snack, setSnack] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack({
      message: "",
      severity: "",
      open: false,
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarContext.Provider value={(snack, setSnack)}>
          <div className="bg-gray-100 h-screen">
            <AppBar position="static" className={classes.background}>
              <Toolbar className="lg:container">
                <Typography variant="h6" className={classes.title}>
                  Weather Search
                </Typography>
              </Toolbar>
            </AppBar>
            <div className="lg:container pt-10">
              <div className="flex xs:flex-row flex-col">
                <SearchLocation setCurrentWeather={setCurrentWeather} />
                <div className="w-1/6" />
                <CurrentWeather weather={currentWeather} />
              </div>
              <div className="mt-10">
                <LastSearched weather={currentWeather} />
              </div>
            </div>
          </div>
          <Snackbar
            open={snack.open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <MuiAlert
              onClose={handleClose}
              severity={snack.severity}
              elevation={10}
              variant="filled"
            >
              {snack.message}
            </MuiAlert>
          </Snackbar>
        </SnackbarContext.Provider>
      </ThemeProvider>
    </>
  );
}
