import React, {FunctionComponent} from 'react';
import { legendContainer, legendBox, legendText, centerContainer } from './custom-legend.module.scss'

interface CustomLegendProps { 
  onLegendEnter: (security: string) => void;
  onChartLeave: () => void;
  primaryColor: string;
  secondaryColor: string;
 } 
 
 const CustomLegend: FunctionComponent<CustomLegendProps>  = ({ onLegendEnter, onChartLeave, primaryColor, secondaryColor }) => {
  return  ( 
    <div className={legendContainer}>
      <div className={centerContainer}>
        <span role='presentation' onMouseEnter={() => onLegendEnter('Nonmarketable')} onMouseLeave={onChartLeave} className={legendText}>
          <div className={legendBox} style={{ backgroundColor: primaryColor}}></div> Marketable Security
        </span>
        <span role='presentation' onMouseEnter={() => onLegendEnter('Marketable')} onMouseLeave={onChartLeave} className={legendText}>
          <div className={legendBox} style={{ backgroundColor: secondaryColor}}></div> Non-Marketable Security
        </span>
      </div>
    </div>
  ); 
}; 
export default CustomLegend;
