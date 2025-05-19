/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  pipeline,
  PipelineType,
  ProgressCallback,
  ProgressInfo,
  Tensor,
  TranslationPipeline,
} from "@huggingface/transformers";

class Translator {
  static task: PipelineType = "translation";
  static model = "Xenova/nllb-200-distilled-600M";
  static instance: TranslationPipeline | null = null;

  static async getInstance(progress_callback: ProgressCallback) {
    if (!this.instance) {
      this.instance = (await pipeline(this.task, this.model, {
        progress_callback,
      })) as TranslationPipeline;
    }

    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event: MessageEvent) => {
  // Retrieve the translation pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  const translator = await Translator.getInstance(
    (progressInfo: ProgressInfo) => {
      // We also add a progress callback to the pipeline so that we can
      // track model loading.
      self.postMessage(progressInfo);
    }
  );

  // Actually perform the translation
  const output = await translator(event.data.text, {
    tgt_lang: event.data.tgt_lang,
    src_lang: event.data.src_lang,

    // Allows for partial output
    callback_function: (
      data: { output_token_ids: Tensor | number[] | bigint[] }[]
    ) => {
      self.postMessage({
        status: "update",
        output: translator.tokenizer.decode(data[0].output_token_ids, {
          skip_special_tokens: true,
        }),
      });
    },
  } as any);

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: output,
  });
});
