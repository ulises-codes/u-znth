/// <reference path="../types.d.ts" />
import type { ReactNode } from 'react';
declare type WaveToggleProps = {
    wave: OscillatorProps['shape'];
    children: ReactNode;
};
export default function WaveToggle({ children, wave }: WaveToggleProps): JSX.Element;
export {};
