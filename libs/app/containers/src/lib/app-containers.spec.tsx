import React from "react";
import { render } from "@testing-library/react";

import AppContainers from "./app-containers";

describe("AppContainers", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AppContainers />);
    expect(baseElement).toBeTruthy();
  });
});
