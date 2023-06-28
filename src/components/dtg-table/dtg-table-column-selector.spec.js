import React from "react";
import { render } from "@testing-library/react";
import DtgTableColumnSelector from "./dtg-table-column-selector";

const TestData = [
    {
        field: 'date',
        label: 'Pretty Date',
        active: true,
        default: true
    },
    {
        field: 'time',
        label: 'Pretty Time',
        active: false,
        default: false
    },
    {
        field: 'name',
        label: 'Pretty Name',
        active: false,
        default: false
    },
];

describe('DTG table column selector', () => {

    it('should display columns for selection', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);

            expect(getByText(TestData[0].label)).toBeInTheDocument();
            expect(getByText(TestData[1].label)).toBeInTheDocument();
            expect(getByText(TestData[2].label)).toBeInTheDocument();
    });

    it('should display default title with defaults selected', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);
        
        expect(getByText("DEFAULTS")).toBeInTheDocument();
    });

    it('should display additional title with additional checkboxes not selected', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);
        
        expect(getByText("ADDITIONAL")).toBeInTheDocument();
    });

    it('should display number of selected columns out of total', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);

        expect(getByText("1 selected of 3")).toBeInTheDocument();
    });

    it('should display reset button', () => {
        const {getByRole} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);

        expect(getByRole('button', {name: 'Reset'})).toBeInTheDocument();
    });

});