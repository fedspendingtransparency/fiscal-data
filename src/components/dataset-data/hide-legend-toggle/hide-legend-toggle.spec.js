import React from 'react';
import { render } from "@testing-library/react";
import HideLegendToggle from './hideLegendToggle';
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import userEvent from '@testing-library/user-event';


describe('Legend Show/Hide Toggle', ()=> {
    const text = 'Toggle Text';
    const icon = faSlidersH;
    const onToggleLegendlMock = jest.fn();

    it('is defined', ()=> {
      const {getByRole} = render(<HideLegendToggle
        displayText={text} 
        displayIcon={icon}
        showToggle={true} 
        onToggleLegend={onToggleLegendlMock} 
        selectedTab={true}/>);
        expect(getByRole('button', {name: text})).toBeInTheDocument();
    });


    it('calls toggle function when selected', ()=> {
      const {getByRole} = render(<HideLegendToggle
        displayText={text} 
        displayIcon={icon}
        showToggle={true} 
        onToggleLegend={onToggleLegendlMock} 
        selectedTab={true}/>);
        
      const toggleButton = getByRole('button', {name: text});
      userEvent.click(toggleButton);
      expect(onToggleLegendlMock).toHaveBeenCalledTimes(1);
    });

    it('does not display when selectedTab is false', ()=> {
      const {queryByRole} = render(<HideLegendToggle
        displayText={text} 
        displayIcon={icon}
        showToggle={true} 
        onToggleLegend={onToggleLegendlMock} 
        selectedTab={false}/>);
        
      expect(queryByRole('button', {name: text})).not.toBeInTheDocument();
    });
});
