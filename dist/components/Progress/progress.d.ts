import React, { FC } from 'react';
import { ThemePros } from '../Icon/icon';
export interface ProgressProps {
    percent: number;
    strokeHeight?: number;
    showText?: boolean;
    styles?: React.CSSProperties;
    theme?: ThemePros;
}
export declare const Progress: FC<ProgressProps>;
export default Progress;
