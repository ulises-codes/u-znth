/// <reference types="src/worklet" />
export default class Oscillator extends AudioWorkletProcessor {
    id: number;
    notePropsLength: number;
    commView: Int32Array;
    notesView: Float64Array;
    paramsView: Float64Array;
    startIndex: number;
    endIndex: number;
    params: Float64Array;
    globalParams: Float64Array;
    peakVol: number[];
    prevVol: number[];
    state: ('' | 'ATTACK' | 'REATTACK' | 'DECAY' | 'PRESS' | 'RELEASE' | 'RELEASED')[];
    sustainDuration: number;
    constructor({ processorOptions: { id, notesSAB, paramsSAB, paramsLength, commSAB, notePropsLength, globalParamsStartIndex, }, }: Omit<AudioWorkletNodeOptions, 'processorOptions'> & {
        processorOptions: ProcessorOptions;
    });
    calculateSlope(param: number, volume: number): number;
    calculateVolume(v: number, a: number, x: number, h: number): number;
    process(_inputs: Float32Array[][], outputs: Float32Array[][]): boolean;
}
