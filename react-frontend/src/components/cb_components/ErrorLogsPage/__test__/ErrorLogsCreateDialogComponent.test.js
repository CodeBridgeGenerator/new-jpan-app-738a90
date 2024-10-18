import React from "react";
import { render, screen } from "@testing-library/react";

import ErrorLogsCreateDialogComponent from "../ErrorLogsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders errorLogs create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ErrorLogsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("errorLogs-create-dialog-component")).toBeInTheDocument();
});
