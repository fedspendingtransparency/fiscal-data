import React from 'react';
import renderer from 'react-test-renderer';
import HideLegendToggle from './hideLegendToggle';

describe('Legend Show/Hide Toggle', ()=> {
    let showLegend = true;
    let component, instance;
    beforeEach(()=> {
        renderer.act(()=> {
            component = renderer.create(<HideLegendToggle
                legend={showLegend} showToggle={true} onToggleLegend={jest.fn()} selectedTab={1}
                                        />);
        });
        instance=component.root;
    });

    it('is defined', ()=> {
        expect(instance.findByType(HideLegendToggle)).toBeDefined();
    });

    it('gives ability to hide legend when visible', ()=> {
        expect(instance.findByType(HideLegendToggle)
          .find(e => e.type.toString() === 'span').children[1]).toBe("Hide Legend");
    });

    it('gives ability to show legend when hidden', ()=> {
      showLegend = false;
      renderer.act(() => {
        component.update(<HideLegendToggle
          legend={showLegend} showToggle={true} onToggleLegend={jest.fn()} selectedTab={1}
                         />)
      });

      expect(instance.findByType(HideLegendToggle)
        .find(e => e.type.toString() === 'span').children[1]).toBe("Show Legend");
    });
});
