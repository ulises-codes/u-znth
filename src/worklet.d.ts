declare const AudioWorkletProcessor

declare const currentTime: number
declare const sampleRate: number

declare interface AudioWorkletProcessor {
  readonly port?: MessagePort

  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean
}

declare function registerProcessor(
  name: string,
  processorCtor: (new (
    options: Omit<AudioWorkletNodeOptions, 'processorOptions'> & {
      processorOptions: ProcessorOptions
    }
  ) => AudioWorkletProcessor) & {
    parameterDescriptors?: AudioParamDescriptor[]
  }
): undefined

declare interface ProcessorOptions {
  id: number
  notesSAB: SharedArrayBuffer
  paramsSAB: SharedArrayBuffer
  commSAB: SharedArrayBuffer
  paramsLength: number
  notePropsLength: number
  globalParamsStartIndex: number
}
