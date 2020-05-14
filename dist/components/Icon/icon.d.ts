import { FC } from 'react';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
export declare type ThemePros = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark';
export declare type IconProps = FontAwesomeIconProps & {
    theme?: ThemePros;
    className?: string;
};
export declare const Icon: FC<IconProps>;
export default Icon;
