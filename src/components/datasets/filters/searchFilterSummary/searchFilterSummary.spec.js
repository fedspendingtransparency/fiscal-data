import React from 'react'
import renderer from 'react-test-renderer'
import SearchFilterSummary from './searchFilterSummary'
import { sum } from 'd3'
import { mockFilters } from "../../mockData/mockFilters"
import filterTools from '../../../../transform/filters/filterDefinitions';

describe("Search Filter Summary", ()=> {
    let component = renderer.create(),
        instance,
        activeFilters = [],
        searchQuery = "",
        summary,
        onGroupResetSpy = null,
        onIndividualResetSpy = null,
        filters;

    const filtersByGroupKeyWithNameSpy = jest.spyOn(filterTools, 'filtersByGroupKeyWithName');

    const onGroupResetMock = jest.fn();
    const onIndividualResetMock = jest.fn();
    beforeEach(()=> {
        filters = mockFilters;
        filtersByGroupKeyWithNameSpy.mockClear();

        renderer.act(()=> {
            component = renderer.create(
              <SearchFilterSummary searchQuery={searchQuery}
                                   activeFilters={activeFilters}
                                   onGroupReset={onGroupResetMock}
                                   onIndividualReset={onIndividualResetMock}
                                   allFilters={filters}
              />
              );
        });
        instance = component.root;
        onGroupResetSpy = jest.spyOn(instance.props, 'onGroupReset');
        onIndividualResetSpy = jest.spyOn(instance.props, 'onIndividualReset');
        summary = instance.findByType(SearchFilterSummary);
    });

    it("renders element", ()=> {
       expect(summary).toBeDefined();
    });

    it("calls filtersByGroupKeyWithName upon with the active filters and allFilters", async () => {
      // to ensure any dynamically added filters are utilized
      expect(filtersByGroupKeyWithNameSpy).toHaveBeenCalledWith(activeFilters, filters);
    });

    it("renders no children if both searchQuery and activeFilters are empty", ()=> {
        expect(summary.children.length).toBe(0);
    });

    it("renders both search summary and filter summary when both searchQuery and activeFilters are not empty", () => {
      filters = mockFilters;
      searchQuery = "test";
      activeFilters = ["startDateRangeThree", "savingsBonds"];

      renderer.act(() => {
        component = renderer.create(
          <SearchFilterSummary searchQuery={searchQuery}
                               activeFilters={activeFilters}
                               onGroupReset={onGroupResetMock}
                               onIndividualReset={onIndividualResetMock}
                               allFilters={filters}
          />
        );
      });

      instance = component.root;
      onGroupResetSpy = jest.spyOn(instance.props, 'onGroupReset');
      onIndividualResetSpy = jest.spyOn(instance.props, 'onIndividualReset');
      summary = instance.findByType(SearchFilterSummary);

      expect(summary.children.length).toBe(2);
    })

    it("clears selected filter when onClick on specific filter", ()=> {
      expect(summary.children[1].children.length).toBe(3);
      renderer.act(() => {
          summary.children[1].children[0].children[1].props.onClick();
      });
      expect(onIndividualResetSpy).toHaveBeenCalledTimes(1);
    });

    it("clears all filters", ()=> {
      const clearAll = summary.children[1].children[2].children[1].props;
      expect(clearAll.children[0]).toEqual("Clear All Filters");
      renderer.act(() => {
          clearAll.onClick();
      });
      expect(onGroupResetSpy).toHaveBeenCalledWith("startDate");
      expect(onGroupResetSpy).toHaveBeenCalledWith("topics");
      expect(onGroupResetSpy).toHaveBeenCalledTimes(2);
    });
});
