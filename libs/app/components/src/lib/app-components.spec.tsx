import React from "react";
import { render } from "@testing-library/react";

import AppComponents from "./app-components";

describe("AppComponents", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AppComponents />);
    expect(baseElement).toBeTruthy();
  });
});
