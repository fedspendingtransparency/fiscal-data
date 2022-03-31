import React from 'react'
import renderer from 'react-test-renderer'
import SelectAll from './selectAll'

describe("Select All component", ()=> {
  let mockFields = [
    {
      active: true,
      field: "field_1",
      label: "Field 1"
    },
    {
      active: true,
      field: "field_2",
      label: "Field 2"
    },
    {
      active: true,
      field: "field_3",
      label: "Field 3"
    }
  ]


  const mockOnUpdateFields = (updatedArray) => {
    //parent must handle this update
    mockFields = updatedArray
  }

  let component = renderer.create();
  renderer.act(()=> {
    component = renderer.create(
      <SelectAll isVisible fields={mockFields} onUpdatedFields={mockOnUpdateFields} />
    );
  });

  let instance = component.root;

  let selectAll = instance.findByType("label");
  const label = selectAll.props.children[2];
  let checked = selectAll.props.children[0].props.checked;
  let allChecked = mockFields.every(f => f.active);

  it("renders when fields are visible", ()=> {
    expect(label).toBe("Select All")
  })

  it("sets checked to true when all are selected", ()=> {
    // when all fields are active, select all is check and indeterminate which causes the dash
    // is false
    expect(allChecked).toBeTruthy();
    expect(checked).toBe(allChecked);
  })

  it("sets checked to false when only one field is unchecked", ()=> {
    const newComponent = renderer.create();
    const updatedField = Object.assign({}, mockFields[1], {active: false});
    const updated = Object.assign([], mockFields, {1: updatedField});
    allChecked = updated.every(f => f.active);
    renderer.act(() => {
      newComponent.update(<SelectAll isVisible fields={updated} />);
    });
    instance = newComponent.root;
    selectAll = instance.findByType("label");
    checked = selectAll.props.children[0].props.checked;

    // if the user manually removes any label selections (anything less than "all") the box will
    // show a dash aka indeterminate but not checked
    expect(allChecked).toBeFalsy();
    expect(checked).toBe(allChecked);
  });
});
