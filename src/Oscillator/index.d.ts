/// <reference path="../types.d.ts" />
/// <reference types="react" />
interface OscillatorUI {
    isOn: boolean;
    oscillators: {
        [key: string]: OscillatorProps;
    };
    togglePower: () => void;
    handleValueChange: (id: string, values: Partial<OscillatorProps>) => void;
}
export default function OscillatorUI({ isOn, oscillators, handleValueChange, togglePower, }: OscillatorUI): JSX.Element;
export {};
