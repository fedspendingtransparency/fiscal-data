import { utcParse, utcFormat } from "d3-time-format"
import { select, selectAll } from "d3-selection"
import { formatForDataType } from "./utils";
import {groupBy} from "../helpers/helpers";

const d3 = { select, selectAll },
    tooltipClass = 'tooltip',
    pointLayerClass = 'pointLayer',
    pointClass = 'tooltipPoint',
    tooltipDimensions = {
        height: 110,
        width: 300
    },
    tooltipPadding = 20,
    maxContentWidth = tooltipDimensions.width - tooltipPadding * 2,
    formatDate = utcFormat("%m/%d/%Y"),
    parseDate = utcParse("%Y-%m-%d");

const dots = [];
let tooltipG;
let pointLayer;
export const maxTooltipHitbox = 20;
export const minTooltipHitbox = 7.5;


const initTooltip = (
  {
    data,
    currentScales,
    container,
    visibleContainer,
    visibleFields,
    dateField,
    chartDimensions,
    labels,
    dataType,
    toolTipDateKey
  }) => {

  const mapData = () => data.reduce((accumulator, r) => {
    return accumulator.concat(visibleFields.map(f => {
      return {
        value: r[f],
        field: f,
        date: r[dateField],
        displayDate: toolTipDateKey ? r[toolTipDateKey] : formatDate(parseDate(r[dateField]))
      }
    }));
  }, []).filter(ttr => ttr.value !== null && ttr.value !== undefined && ttr.value !== 'null');

    const placeTooltip = function () {
        const box = visibleContainer.node().getBoundingClientRect(),
            yOffset = 15,
            limits = {
                low: box.height - tooltipDimensions.height - yOffset,
                left: tooltipDimensions.width / 2,
                right: box.width - tooltipDimensions.width - chartDimensions.yAxisWidth
            };

        let x = currentScales.x(parseDate(this.date)) - chartDimensions.yAxisWidth - tooltipDimensions.width / 2,
            y = currentScales.y(this.value) + yOffset;

        // reposition x if needed
        if (x > limits.right) {
            x = limits.right;
        } else if (x < 10) {
            x = 10;
        }

        // reposition y if needed
        if (y > limits.low) {
            y = currentScales.y(this.value) - 16 - tooltipDimensions.height;
        }

        return `translate(${x + chartDimensions.yAxisWidth}, ${y})`;
    };

    const placeTitle = d => {
        let scaleFactor;

        const translateString = `translate(${tooltipPadding}, ${tooltipPadding})`

        const title = tooltipG.append('text')
            .text(() => labels[d.field])
            .attr('data-testid', 'title')
            .attr('font-size', 18)
            .attr('font-weight', 600)
            .attr('fill', '#555555')
            .attr('dy', 14)
            .attr('transform', translateString)

        //shrink the title if needed
        const titleWidth = title.node().getBoundingClientRect().width;
        if (titleWidth > maxContentWidth) {
            scaleFactor = maxContentWidth/titleWidth;

            title.attr('transform', `${translateString} scale(${scaleFactor})`)
        }
    };

    const placeDate = d => {
        tooltipG.append('text')
            .text(() => d.displayDate)
            .attr('data-testid', 'date')
            .attr('font-size', 16)
            .attr('font-weight', 'normal')
            .attr('fill', '#666666')
            .attr('transform', `translate(${tooltipPadding}, ${tooltipDimensions.height - tooltipPadding})`)
    };

    const placeValue = d => {
        tooltipG.append('text')
            .text(() => {
                return formatForDataType(d.value, dataType)
            })
            .attr('data-testid', 'value')
            .attr('font-size', 16)
            .attr('font-weight', 600)
            .attr('fill', '#2272ce')
            .attr('text-anchor', 'end')
            .attr('transform', `translate(${tooltipDimensions.width - tooltipPadding}, ${tooltipDimensions.height - tooltipPadding})`)
    };

    const placeSeparator = () => {
        tooltipG.append('line')
            .attr('stroke', '#dddddd')
            .attr('x1', tooltipPadding)
            .attr('y1', tooltipDimensions.height / 2)
            .attr('x2', tooltipDimensions.width - tooltipPadding)
            .attr('y2', tooltipDimensions.height / 2)
    };

    const showPoint = d => {
        pointLayer.append('circle')
            .raise()
            .classed(pointClass, true)
            .attr('r', 7.5)
            .attr('transform', `translate(${currentScales.x(parseDate(d.date))}, ${currentScales.y(d.value)})`)
            .attr('fill', 'transparent')
            .transition()
                .duration(10)
                .attr('fill', '#0071bc');
    };

    const showTooltip = d => {
        tooltipG = container.append('g')
            .classed(tooltipClass, true)
            .attr('transform', placeTooltip.bind(d));

        tooltipG.append('rect')
            .attr('width', tooltipDimensions.width)
            .attr('height', tooltipDimensions.height)
            .attr('fill', 'white')
            .attr('stroke', '#d6d7d9')
            .attr('stroke-width', '1');

        placeTitle(d);
        placeDate(d);
        placeValue(d);
        placeSeparator();
    };

    const onMouseOver = d => {
        showPoint(d);
        showTooltip(d);
    };

    const onMouseOut = () => {
        tooltipG.remove();

        d3.selectAll('.' + pointClass).remove();

        dots.forEach(curDots => curDots.transition().duration(10).attr('fill', 'transparent'));
    };

    const placeTooltips = () => {
        const layerClass = 'dots';
        const mappedData = mapData();
        const groupedData = groupBy(mappedData, 'field');
        const box = container.node().getBoundingClientRect();
        const containerWidth = box.width - chartDimensions.yAxisWidth;

        container.select(`g.${layerClass}`).remove();
        container.select(`g.${pointLayerClass}`).remove();

        pointLayer = container.append('g')
            .raise()
            .classed(pointLayerClass, true);

        dots.length = 0;

        Object.keys(groupedData).forEach(key => {
          const group = groupedData[key];
          const radius = calculateRadius(containerWidth, group.length);
          dots.push(container.append('g')
            .classed(layerClass, true)
            .selectAll('circle')
            .data(group)
            .enter()
            .append('circle')
            .classed('hitBox', true)
            .attr('r', radius)
            .attr('fill', 'transparent')
            .attr('transform', d => `translate(${currentScales.x(parseDate(d.date))}, ${currentScales.y(d.value)})`)
            .on('mouseover', onMouseOver)
            .on('mouseout', onMouseOut)
          );
        });
    };

    placeTooltips();
}

/**
 * Determines the radius of the hitbox for the data points drawn for the line graphs. Formula = (containerWidth / dataLen) / 2.
 * With the constraints that the radius falls within the boundaries of minTooltipHitbox and maxTooltipHitbox.
 * @param containerWidth {number} - The Width of the available chart container for the line to be drawn in.
 * @param dataLen {number}        - The number of data elements drawn on a given line
 * @returns {number}              - The radius of the data point dots' hit boxes to 2 decimal places. Defaulted at minTooltipHitbox.
 */
export const calculateRadius = (containerWidth, dataLen) => {
  let radius = minTooltipHitbox;
  if(dataLen && containerWidth) {
    radius = (containerWidth / dataLen) / 2;
    if (radius > maxTooltipHitbox) {
      radius = maxTooltipHitbox;
    } else if (radius < minTooltipHitbox) {
      radius = minTooltipHitbox;
    } else {
      radius = Number(radius.toFixed(2)); // No reason to add more precision to a fraction of a pixel.
    }
  }
  return radius;
};

export default initTooltip;
