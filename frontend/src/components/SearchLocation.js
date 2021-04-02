import { Button, CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { SnackbarContext } from "../App";
import { handleAddressDetails } from "../utils";

export default function SearchLocation(props) {
  const { setCurrentWeather } = props;
  const [address, setAddress] = useState();
  const [addressDetails, setAddressDetails] = useState();
  const [loadingZipcode, setLoadingZipcode] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const setSnack = useContext(SnackbarContext);

  const checkWeather = () => {
    if (!loadingZipcode) {
      setLoadingWeather(true);
      axios
        .get(
          `api/weathers/${addressDetails?.zipcode},${addressDetails?.country}`
        )
        .then((res) => {
          setLoadingWeather(false);
          setCurrentWeather(res.data);
        })
        .catch((err) => {
          setLoadingWeather(false);
          setSnack({
            message: "Could not find a city for selected address / zipcode",
            severity: "error",
            open: true,
          });
          console.error(err);
        });
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingZipcode(true);
      if (address) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { placeId: address.value.place_id },
          (results, status) => {
            if (status === "OK") {
              setLoadingZipcode(false);
              const handledAddresDetails = handleAddressDetails(results);
              setAddressDetails(handledAddresDetails);
              if (handledAddresDetails.zipcode === null) {
                setSnack({
                  message: "Could not find zipcode for selected address",
                  severity: "info",
                  open: true,
                });
              }
            }
          }
        );
      } else {
        setLoadingZipcode(false);
      }
    };
    fetchDetails();
  }, [address, setSnack]);

  return (
    <>
      <div className="flex flex-col w-2/5 px-5" style={{ minWidth: "370px" }}>
        <GooglePlacesAutocomplete
          placeholder="Type in an address"
          selectProps={{
            address,
            onChange: setAddress,
          }}
        />
        <div className="mt-5" />
        <Button color="primary" variant="contained" onClick={checkWeather}>
          {(loadingZipcode || loadingWeather) && (
            <CircularProgress size={32} color="inherit" />
          )}
          {!loadingZipcode &&
            !loadingWeather &&
            "show me the current temperature"}
        </Button>
      </div>
    </>
  );
}
