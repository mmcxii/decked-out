import React from "react";
import { render } from "@testing-library/react";

import AppPages from "./app-pages";

describe("AppPages", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AppPages />);
    expect(baseElement).toBeTruthy();
  });
});
