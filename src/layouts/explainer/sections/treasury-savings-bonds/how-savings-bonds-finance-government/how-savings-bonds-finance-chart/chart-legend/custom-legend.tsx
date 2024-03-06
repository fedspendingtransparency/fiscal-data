import React, {FunctionComponent} from 'react';
import { legendContainer, legendBox, legendText } from './custom-legend.module.scss'

interface CustomLegendProps { 
  onLegendEnter: (security: boolean) => void;
onChartLeave: () => void;
primaryColor: string;
secondaryColor: string;
 } 
 
 const CustomLegend: FunctionComponent<CustomLegendProps>  = ({ onLegendEnter, onChartLeave, primaryColor, secondaryColor }) => {
  return  ( 
    <div className={legendContainer}>
      <div role='presentation' onMouseEnter={() => onLegendEnter(true)} onMouseLeave={onChartLeave} className={legendText}>
        <div className={legendBox} style={{ backgroundColor: primaryColor}}></div> Marketable Security
      </div>
      <div role='presentation' onMouseEnter={() => onLegendEnter(false)} onMouseLeave={onChartLeave} className={legendText}>
        <div className={legendBox} style={{ backgroundColor: secondaryColor}}></div> Non-Marketable Security
      </div>
    </div>
  ); 
}; 
export default CustomLegend;
