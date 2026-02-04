import { mockData, fields, dateField, mockShadingOptions } from './mockData';
import { calculateRadius, minTooltipHitbox, maxTooltipHitbox } from './tooltip';
import drawChart, { addHoverEffects } from './index';

describe('Primary Chart', () => {
  const container = document.createElement('div');

  const chart = drawChart(mockData.data, container, dateField, fields, mockData.meta.labels, '', {
    format: mockData.meta.dataTypes.a,
  });

  it('displays the expected number of lines on the chart', () => {
    expect(container.querySelectorAll('[data-testid="dataviz-line"]').length).toBe(3);
  });

  it('places x and y axes', () => {
    expect(container.querySelectorAll('.axis--x').length).toBe(1);
    expect(container.querySelectorAll('.axis--y').length).toBe(1);
  });

  it('places the expected number of tooltip targets', () => {
    expect(container.querySelectorAll('.dots circle').length).toBe(mockData.data.length * fields.length);
  });

  it('shows tooltip with desired attributes when moused over', () => {
    expect(container.querySelector('.tooltip')).toBeNull();
    const firstTooltip = container.querySelectorAll('.dots circle')[0];
    const mouseOverEvent = firstTooltip.__on[0];
    mouseOverEvent.value(firstTooltip.__data__);
    const tooltipG = container.querySelector('.tooltip');
    expect(tooltipG).not.toBeNull();

    const title = container.querySelector('text[data-testid="title"]');
    expect(title.textContent).toStrictEqual(mockData.meta.labels['a']);
    // mockData's start year is 2006 and the month and day are always January 1st.
    const date = container.querySelector('text[data-testid="date"]');
    expect(date.textContent).toStrictEqual('01/01/2006');
    const value = container.querySelector('text[data-testid="value"]');
    expect(value.textContent).toStrictEqual('$1.00');
    tooltipG.parentNode.removeChild(tooltipG);
  });

  it('removes the tooltip when moused out', () => {
    expect(container.querySelector('.tooltip')).toBeNull();
    const secondTooltip = container.querySelectorAll('.dots circle')[1];
    const mouseOverEvent = secondTooltip.__on[0];
    mouseOverEvent.value(secondTooltip.__data__);
    expect(container.querySelector('.tooltip')).toBeDefined();

    const mouseOutEvent = secondTooltip.__on[1];
    mouseOutEvent.value();
    expect(container.querySelector('.tooltip')).toBeNull();
  });

  it('places no tooltips when configured not to', () => {
    drawChart(mockData.data, container, dateField, fields, mockData.labels, 'millions', {
      noTooltip: true,
    }); // drawChart clears the container; previous tests should not interfere

    expect(container.querySelectorAll('.dots circle').length).toBe(0);
  });

  it('resizes chart to expected size when onUpdateChartWidth is called', () => {
    let chartContainer = container.querySelector('svg[data-test-id="chartContainer"]');

    expect(chartContainer.getAttribute('width')).toBe('0');
    // Jest does not fully support getBoundingClientRect, it must be mocked or else
    // all values come back as 0.
    container.getBoundingClientRect = jest.fn(() => {
      return {
        top: 0,
        left: 0,
        width: '400px',
        height: '400px',
      };
    });

    chart.onUpdateChartWidth(container, fields);
    chartContainer = container.querySelector('svg[data-test-id="chartContainer"]');
    expect(chartContainer.getAttribute('width')).toBe('400px');
  });

  it('updates attributes when onFieldUpdates is called', () => {
    chart.onFieldUpdates([fields]);
    const updatedLines = container.querySelectorAll('[data-testid="dataviz-line"]');
    expect(updatedLines[0].getAttribute('opacity')).toBe('1');
    expect(updatedLines[0].getAttribute('stroke-width')).toBe('1');
  });
});

describe('Tooltip calculateRadius', () => {
  it('returns the minimum hitbox size if input parameters are bad', () => {
    expect(calculateRadius(0, 0)).toStrictEqual(minTooltipHitbox);
    expect(calculateRadius(80, 0)).toStrictEqual(minTooltipHitbox);
    expect(calculateRadius(0, 10)).toStrictEqual(minTooltipHitbox);
  });

  it('calculates an expected radius given proper inputs without exceeding the boundaries', () => {
    let containerWidth = 400;
    let dataLen = 20;
    let radius = 10; // Radius = (400/20) / 2 = 10.
    expect(calculateRadius(containerWidth, dataLen)).toStrictEqual(radius);

    containerWidth = 500;
    dataLen = 27;
    radius = 9.26; // Radius = (500/27) / 2 = 9.259259259 = 9.26 (precision of 2 decimal places).
    expect(calculateRadius(containerWidth, dataLen)).toStrictEqual(radius);
  });

  it('clips the hitbox radius to the appropriate min/max limits as needed', () => {
    let containerWidth = 400;
    let dataLen = 100;
    // Radius = (400/100) / 2 = 2. Since 2 is less than minTooltipHitbox, radius = minTooltipHitbox.
    let radius = minTooltipHitbox;
    expect(calculateRadius(containerWidth, dataLen)).toStrictEqual(radius);

    containerWidth = 400;
    dataLen = 4;
    // Radius = (400/4) / 2 = 50. Since 50 > maxTooltipHitbox, radius = maxTooltipHitbox.
    radius = maxTooltipHitbox;
    expect(calculateRadius(containerWidth, dataLen)).toStrictEqual(radius);
  });
});

describe('Primary Chart hover logic', () => {
  it('triggers hover callback and marker placement on mousemove', () => {
    const hoverContainer = document.createElement('div');
    hoverContainer.id = 'mousemove-chart';
    document.body.appendChild(hoverContainer);
    drawChart(mockData.data, hoverContainer, dateField, fields, mockData.meta.labels, '', {
      format: mockData.meta.dataTypes.a,
    });
    const hoverSpy = jest.fn();
    addHoverEffects(mockData.data, 'mousemove-chart', dateField, fields, hoverSpy);
    const hoverSpace = hoverContainer.querySelector('#line-chart-hover-effects');
    hoverSpace.dispatchEvent(new MouseEvent('mousemove', { offsetX: 10, offsetY: 10 }));
    expect(hoverSpy).toHaveBeenCalled();
  });
});

describe('Primary Chart draw/shading logic', () => {
  it('implements correct shading information', () => {
    const container = document.createElement('div');
    drawChart(mockData.data, container, dateField, fields, mockData.meta.labels, '', mockShadingOptions);
    const area = container.querySelector('path.area');
    expect(area).not.toBeNull();
    expect(area.style.fill).toBe('red');
    const pattern = container.querySelectorAll('pattern#gradient');
    expect(pattern).not.toBeNull();
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });
});
