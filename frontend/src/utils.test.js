import { describe, expect, it } from "@jest/globals";
import { handleAddressDetails } from "./utils";

describe("handleAddressDetails function", () => {
  it("should return zipcode and country", () => {
    const address = [
      {
        address_components: [
          { long_name: 88000, types: ["postal_code"] },
          { short_name: "BR", types: ["country", "political"] },
        ],
      },
    ];

    const value = handleAddressDetails(address);
    expect(value.zipcode).toBe(88000);
    expect(value.country).toBe("BR");
  });

  it("should return zipcode null if not found", () => {
    const address = [
      {
        address_components: [
          { short_name: "BR", types: ["country", "political"] },
        ],
      },
    ];

    const value = handleAddressDetails(address);
    expect(value.zipcode).toBe(null);
    expect(value.country).toBe("BR");
  });

  it("should return country null if not found", () => {
    const address = [
      {
        address_components: [{ long_name: 88000, types: ["postal_code"] }],
      },
    ];

    const value = handleAddressDetails(address);
    expect(value.zipcode).toBe(88000);
    expect(value.country).toBe(null);
  });
});
