export function handleAddressDetails(address) {
  let zipcode = null;
  let country = null;
  address[0]?.address_components?.forEach((entry) => {
    if (entry.types?.[0] === "postal_code") {
      zipcode = entry.long_name;
    }
    if (entry.types?.[0] === "country" && entry.types?.[1] === "political") {
      country = entry.short_name;
    }
  });
  return { zipcode: zipcode, country: country };
}
