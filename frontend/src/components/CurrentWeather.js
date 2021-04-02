export default function CurrentWeather(props) {
  const { weather } = props;

  return (
    <div className="px-5 xs:py-0 py-5">
      <div className="flex bg-white shadow-xl rounded-sm w-96 h-32 justify-center items-center">
        {weather && weather.city && weather.temperature ? (
          <div className="flex flex-col font-bold">
            <span className="text-xl pb-4">{weather.city}</span>
            <span className="text-4xl">{weather.temperature}º F</span>
          </div>
        ) : (
          <span className="text-xl font-light italic">Search a location</span>
        )}
      </div>
    </div>
  );
}
