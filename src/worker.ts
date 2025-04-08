import { pipeline, PipelineType, ProgressCallback, TextStreamer, TranslationPipeline } from '@huggingface/transformers';

class MyTranslationPipeline {
  static task: PipelineType = 'translation';
  static model = 'Xenova/nllb-200-distilled-600M';
  static instance: Promise<TranslationPipeline> | null = null;
  static async getInstance(progress_callback: ProgressCallback) {
    this.instance ??= pipeline(this.task, this.model, { progress_callback }) as Promise<TranslationPipeline>;
    
    return this.instance;
  }
}