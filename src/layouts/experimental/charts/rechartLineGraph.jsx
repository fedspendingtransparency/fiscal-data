/* istanbul ignore file */
import React, {useEffect, useState} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiPrefix, basicFetch } from '../../../utils/api-utils';

const data = [
  {
    name: '2023',
    color: '#00796B',
    duration: 1300,
    data: [
      { category: 'Oct', value: 0.0 },
      { category: 'Nov', value: 0.25 },
      { category: 'Dec', value: 0.35 },
      { category: 'Jan', value: 0.65 },
      { category: 'Feb', value: 0.75 },
      { category: 'Mar', value: 0.95 },
      { category: 'Arp', value: 1.15 },
      { category: 'May', value: 1.25 },
    ],
  },
  {
    name: '2022',
    color: '#99C8C4',
    duration: 2000,
    data: [
      { category: 'Oct', value: 0 },
      { category: 'Nov', value: 0.15 },
      { category: 'Dec', value: 0.33 },
      { category: 'Jan', value: 0.48 },
      { category: 'Feb', value: 0.69 },
      { category: 'Mar', value: 0.88 },
      { category: 'Arp', value: 1.12 },
      { category: 'May', value: 1.13 },
      { category: 'Jun', value: 1.22 },
      { category: 'Jul', value: 1.22 },
      { category: 'Aug', value: 1.35 },
      { category: 'Sep', value: 1.4 },
    ],
  },
  {
    name: '5 year average (2017-2022)',
    color: '#555',
    duration: 2000,
    data: [
      { category: 'Oct', value: 0 },
      { category: 'Nov', value: 0.22 },
      { category: 'Dec', value: 0.63 },
      { category: 'Jan', value: 0.85 },
      { category: 'Feb', value: 0.95 },
      { category: 'Mar', value: 1.25 },
      { category: 'Arp', value: 1.66 },
      { category: 'May', value: 1.75 },
      { category: 'Jun', value: 1.99 },
      { category: 'Jul', value: 2.23 },
      { category: 'Aug', value: 2.55 },
      { category: 'Sep', value: 2.95 },
    ],
  },
];

const TickCount = (props) => {
  const {x ,y, payload } = props;
  const index = payload.index;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x={0} y={0} dy={16} textAnchor='middle' fill='#666'>
        {index % 3 === 0 ? payload.value : ''}
      </text>
    </g>
  )
};

 const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p>{label}</p>

        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{color: entry.stroke }}>
            <span 
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: entry.stroke,
                marginRight: '5px',
              }} 
            />
              {`${entry.name}: $${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div>asasasas</div>
  );
 };

const ReLineGraph = () => {
  const [currentFiscalYear, setCurrentFiscalYear] = useState("");
  const [priorFiscalYear, setPriorFiscalYear] = useState("");
  const endpointUrl ='v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691&sort=-record_date&page[size]=1';
  const priorYearUrl = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691,record_calendar_month:eq:09,record_fiscal_year:eq:{prior_fiscal_year}&sort=-record_date&page[size]=1'

useEffect(() => {
  basicFetch(`${apiPrefix}${endpointUrl}`).then(result => {
    if (result?.data) {
      setCurrentFiscalYear(result.data[0].record_fiscal_year);
      setPriorFiscalYear(result.data[0].current_fiscal_year-2);
    }
  });
}, []);

console.log("current ",currentFiscalYear);
console.log("pfy ", priorFiscalYear);
  return (
    <div style={{ width: '800px', height: '600px' }}>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart width={500} height={300} cursor="pointer">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
            <YAxis type="number" domain={[0, 10]} tickCount={9} />
            <Tooltip 
              isAnimationActive={true} 
              animationEasing=';inear' 
            />
            <Legend type="circle" />
            {data.map((e) => (
              <Line 
                dataKey="value" 
                data={e.data} 
                name={e.name} 
                key={e.name} 
                stroke={e.color}
                dot={false}
                strokeWidth={3}
                animationDuration={e.duration}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReLineGraph;
