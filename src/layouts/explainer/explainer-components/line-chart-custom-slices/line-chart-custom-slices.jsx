import React from 'react'

function lineChartCustomSlices(props, onMouseEnter, onMouseMove, onMouseLeave, onFocus, groupOnMouseLeave) {
    console.log(props)
    const handleMouseEnter = (slice) => {
        console.log(slice)
        props.setCurrentSlice(slice)
    }
    return (
        <g onMouseLeave={groupOnMouseLeave}>
            {props.slices.map(slice => (
                <rect
                    x={slice.x0}
                    y={slice.y0}
                    tabIndex={0}
                    width={slice.width}
                    height={slice.height}
                    strokeWidth={0}
                    strokeOpacity={0.75}
                    fillOpacity={0}
                    onMouseEnter={handleMouseEnter}
                    onFocus={onFocus}
                    onMouseMove={handleMouseEnter}
                    onMouseLeave={onMouseLeave ?? (() => props.setCurrentSlice(null))}
                />
            ))}
        </g>
    )
}

export default lineChartCustomSlices