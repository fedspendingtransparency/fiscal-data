import React from "react";
import {render} from "@testing-library/react";
import DtgTableColumnSelector from "./dtg-table-column-selector";

// from col config
const TestData1 = [
    {
        property: 'date',
        name: 'Pretty Date'
    },
    {
        property: 'time',
        name: 'Pretty Time'
    },
    {
        property: 'name',
        name: 'Pretty Name'
    },
];

const TestData = [
    {
        field: 'date',
        label: 'Pretty Date',
        active: true
    },
    {
        field: 'time',
        label: 'Pretty Time',
        active: true
    },
    {
        field: 'name',
        label: 'Pretty Name',
        active: true
    },
];

const TestDataDefaults = ['date', 'time'];

describe('DTG table column selector', () => {

    it('should display all column names', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);

            expect(getByText(TestData[0].label)).toBeInTheDocument();
            expect(getByText(TestData[1].label)).toBeInTheDocument();
            expect(getByText(TestData[2].label)).toBeInTheDocument();
    });

    it('should display default columns under default title', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);
        
        expect(getByText("DEFAULT")).toBeInTheDocument();
        // add other expect
    });

    it('should display non-default columns under additional title', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);
        
        expect(getByText("ADDITIONAL")).toBeInTheDocument();
        // add other expect

    });

    it('should display number of selected columns out of total', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);

        // add expect
    });

    it('should display reset button when other selected different than default', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);

        // add expect
    });

    it('should reset values to default checked when reset button clicked', () => {
        const {getByText} = render(<DtgTableColumnSelector
            fields={TestData}
            isVisible={true}
            />);

        // add expect
    });

});