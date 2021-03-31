/// <reference path="../types.d.ts" />
/// <reference types="react" />
declare type ScreenProps = {
    isOn: boolean;
    oscillator: OscillatorProps;
    currentOsc: string;
};
export default function Screen({ currentOsc, isOn, oscillator }: ScreenProps): JSX.Element;
export {};
