import React from "react";
import { render } from "@testing-library/react";

import AppGraphql from "./app-graphql";

describe("AppGraphql", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AppGraphql />);
    expect(baseElement).toBeTruthy();
  });
});
