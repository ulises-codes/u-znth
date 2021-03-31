/// <reference types="react" />
declare type KeyboardProps = {
    onMouseDown: (note: number) => void;
    onMouseUp: (note: number) => void;
};
export default function Keyboard({ onMouseDown, onMouseUp }: KeyboardProps): JSX.Element;
export {};
