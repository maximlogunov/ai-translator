import { pipeline, PipelineType, ProgressCallback, TranslationPipeline } from '@huggingface/transformers';

class AiTranslator {
  static task: PipelineType = 'translation';
  static model = 'Xenova/nllb-200-distilled-600M';
  static instance: TranslationPipeline | null = null;

  static async getInstance(progress_callback: ProgressCallback) {
    if (!this.instance) {
      this.instance = await pipeline(this.task, this.model, { progress_callback }) as TranslationPipeline;
    }
    return this.instance;
  }
}
