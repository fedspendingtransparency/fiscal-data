import React from 'react';
import { Line } from '@nivo/line';

const LineGraph = () => {
    // const [mouseHover, setMouseHover] = useState(null);
    
    // // const handleMouseMove = (event) => {
    // //     const mouseX=event.nativeEvent.layerX;
    // //     setMouseHover(mouseX);
    // // };
    
    const mockData = [
        // {
        //     id: '1',
        //     data: [
        //         {x:1, y:10},
        //         {x:2, y:15},
        //         {x:3, y:20},
        //     ],
        // },
        // {
        //     id: '2',
        //     data: [
        //         {x:1, y:5},
        //         {x:2, y:10},
        //         {x:3, y:15},
        //     ],
        // },
        // {
        //     id: '3',
        //     data: [
        //         {x:1, y:12},
        //         {x:2, y:7},
        //         {x:3, y:17},
        //     ],
        // },
    ];

    return (
        <div style={{width: '600px', height: '400px', position: 'relative'}} role='presentation'>
            <Line
                data={mockData}
                margin={{top:50, right: 50, bottom: 50, left: 50}} 
                xScale={{type: 'liner'}}
                yScale={{type: 'linear', min: 'auto', stacked: true, reverse: false}}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                height={300}
                width={450}
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                lineWidth={2}
            />
        </div>
    );
};
export default LineGraph;