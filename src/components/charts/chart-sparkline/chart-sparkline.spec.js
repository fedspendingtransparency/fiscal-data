import { mockData, fields, dateField } from './mockData';
import drawChart, { addHoverEffects, hoverEffectsId } from './index';

describe('Sparkline Chart', () => {
  const testId = 'test-chart-id';
  let container;

  beforeAll(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 500,
        height: 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
    });
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.setAttribute('id', testId);
    document.body.appendChild(container);
  });

  it('displays the expected number of lines on the chart', () => {
    drawChart(mockData.data, testId, dateField, fields[0]);
    expect(container.querySelectorAll('[data-test-id="chart-sparkline"]').length).toBe(1);
  });

  it('places one dot on the chart', () => {
    drawChart(mockData.data, testId, dateField, fields[0]);
    expect(container.querySelectorAll('[data-test-id="marker"]').length).toBe(1);
  });

  it('adds hover effects on mouseover and removes them on mouseout', () => {
    drawChart(mockData.data, testId, dateField, fields[0]);

    const hoverFunction = jest.fn();
    addHoverEffects(mockData.data, testId, dateField, fields[0], hoverFunction);

    const hoverEffectsRect = document.getElementById(hoverEffectsId);

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 250,
      clientY: 50,
    });

    hoverEffectsRect.dispatchEvent(event);
    expect(hoverFunction).toHaveBeenCalled();

    hoverFunction.mockClear();
    hoverEffectsRect.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    expect(hoverFunction).toHaveBeenCalledWith(null, null);
  });

  it('renders X-Axis labels and start/end text when showXLabel is true', () => {
    const startLabel = 'Start Label';
    const endLabel = 'End Label';

    drawChart(mockData.data, testId, dateField, fields[0], true, startLabel, endLabel);

    const axis = container.querySelector('.x-label');
    expect(axis).toBeTruthy();

    const texts = container.querySelectorAll('.x-label-text');
    expect(texts.length).toBe(2);
    expect(texts[0].textContent).toBe(startLabel);
    expect(texts[1].textContent).toBe(endLabel);
  });

  it('applies custom formatting options to X labels', () => {
    const customFormatter = { fill: 'blue', 'font-weight': 'bold' };

    drawChart(mockData.data, testId, dateField, fields[0], true, 'Start', 'End', customFormatter);

    const label = container.querySelector('.x-label-text');
    expect(label.getAttribute('fill')).toBe('blue');
    expect(label.getAttribute('font-weight')).toBe('bold');
  });

  it('renders a blue marker for positive values and red for negative values', () => {
    const mixedData = [
      { [dateField]: '2020-01-01', val: 10 },
      { [dateField]: '2020-01-02', val: -10 },
    ];

    drawChart(mixedData.slice(0, 1), testId, dateField, 'val');
    let marker = container.querySelector('[data-test-id="marker"]');
    expect(marker.getAttribute('fill')).toBe('#4971b7'); // Blue

    container.innerHTML = '';
    drawChart(mixedData, testId, dateField, 'val');
    marker = container.querySelector('[data-test-id="marker"]');
    expect(marker.getAttribute('fill')).toBe('#f2655b'); // Red
  });
});
