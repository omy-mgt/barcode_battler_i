
import { HfInference } from '@huggingface/inference';
import { Buffer } from 'buffer';

// Check for the API key's existence
const apiKey = process.env.HUGGING_FACE_API_KEY;
if (!apiKey) {
  throw new Error('HUGGING_FACE_API_KEY environment variable is not set');
}

const hf = new HfInference(apiKey);

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const imageBlob = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-3.5-medium',
      inputs: prompt,
      parameters: {
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${imageBlob.type};base64,${base64}`;
    return dataUrl;
  } catch (error) {
    console.error('Error generating image with Hugging Face:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the image.');
  }
};
