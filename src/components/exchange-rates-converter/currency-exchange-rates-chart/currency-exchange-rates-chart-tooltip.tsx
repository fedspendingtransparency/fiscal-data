import React from 'react';

interface ChartDataItem {
  date: string;
  rate: number;
  pctChange: number | null;
}

interface CustomDualTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chartData: ChartDataItem[];
}

const CustomDualTooltip: React.FC<CustomDualTooltipProps> = ({ active, payload, label, chartData }) => {
  if (active && payload && payload.length && label) {
    const currentIndex = chartData.findIndex(d => d.date === label);
    if (currentIndex === -1) return null;

    const currentData = chartData[currentIndex];
    let absoluteChange: number | null = null;
    if (currentIndex > 0) {
      const previousData = chartData[currentIndex - 1];
      absoluteChange = currentData.rate - previousData.rate;
    }

    const rateColor = '#85bb65';
    const pctColor = '#4a90e2';

    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p style={{ marginBottom: 5, fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: 0, color: 'black', fontWeight: 600 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: rateColor,
              marginRight: 5,
            }}
          ></span>
          Current Rate: {currentData.rate.toFixed(3)}
        </p>
        {absoluteChange !== null && (
          <>
            <p style={{ margin: 0, color: absoluteChange < 0.0 ? 'red' : 'black' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: rateColor,
                  marginRight: 5,
                }}
              ></span>
              Change: {absoluteChange.toFixed(3)}
            </p>
            {currentData.pctChange !== null && (
              <p style={{ margin: 0, color: currentData.pctChange < 0.0 ? 'red' : 'black' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: pctColor,
                    marginRight: 5,
                  }}
                ></span>
                Percentage Change: {currentData.pctChange.toFixed(2)}%
              </p>
            )}
          </>
        )}
      </div>
    );
  }
  return null;
};
export default CustomDualTooltip;
