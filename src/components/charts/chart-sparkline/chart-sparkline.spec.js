import { mockData, fields, dateField } from './mockData';
import drawChart, { addHoverEffects, hoverEffectsId } from './index';

describe('Sparkline Chart', () => {
  const testId = 'test-chart-id';

  const container = document.createElement('div');
  container.setAttribute('id', testId);

  document.body.appendChild(container);

  drawChart(mockData.data, testId, dateField, fields);

  it('displays the expected number of lines on the chart', () => {
    expect(container.querySelectorAll('[data-test-id="chart-sparkline"]').length).toBe(1);
  });

  it('places one dot on the chart', () => {
    expect(container.querySelectorAll('[data-test-id="marker"]').length).toBe(1);
  });

  it('adds hover effects on mouseover and removes them on mouseout', () => {
    const hoverFunction = jest.fn();
    addHoverEffects(mockData.data, testId, dateField, fields[0], hoverFunction);

    const hoverEffectsRect = document.getElementById(hoverEffectsId);

    hoverFunction.mockClear();
    hoverEffectsRect.dispatchEvent(new MouseEvent('mousemove'), { bubbles: true });
    expect(hoverFunction).toHaveBeenCalled();

    hoverFunction.mockClear();
    hoverEffectsRect.dispatchEvent(new MouseEvent('mouseout'), { bubbles: true });
    expect(hoverFunction).toHaveBeenCalledWith(null, null);
  });
});
