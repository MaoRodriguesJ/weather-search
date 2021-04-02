import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import CurrentWeather from "./CurrentWeather";

describe("<CurrentWeather />", () => {
  it("should render search text when no data provided", () => {
    render(<CurrentWeather />);
    const textSpan = screen.getAllByText("Search a location");
    expect(textSpan).toBeTruthy();
  });

  it("should render city and temperature", () => {
    const weather = { city: "Florianópolis", temperature: 50 };
    render(<CurrentWeather weather={weather} />);
    const citySpan = screen.getAllByText("Florianópolis");
    const temperatureSpan = screen.getAllByText("50º F");
    expect(citySpan).toBeTruthy();
    expect(temperatureSpan).toBeTruthy();
  });
});
