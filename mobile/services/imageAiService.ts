import { Buffer } from 'buffer';

const HF_TOKEN =
  process.env.EXPO_PUBLIC_HF_API_KEY ||
  process.env.EXPO_PUBLIC_HF_TOKEN ||
  '';

const HF_MODEL =
  process.env.EXPO_PUBLIC_HF_IMAGE_MODEL ||
  'black-forest-labs/FLUX.1-schnell';

const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const toBase64DataUri = (buffer: ArrayBuffer, mime = 'image/png') => {
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${mime};base64,${base64}`;
};

const normalizePrompt = (prompt: string) =>
  `respectful christian artwork, church-safe, inspirational, no nudity, no violence, no text overlay, ${prompt}`.trim();

async function generateWithHuggingFace(prompt: string): Promise<string | null> {
  if (!HF_TOKEN) return null;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(HF_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'image/png',
        },
        body: JSON.stringify({
          inputs: normalizePrompt(prompt),
          options: { wait_for_model: true, use_cache: false },
          parameters: {
            num_inference_steps: 24,
            guidance_scale: 4,
          },
        }),
      });

      if (response.status === 503 || response.status === 429) {
        await sleep(1200 * attempt);
        continue;
      }

      if (!response.ok) {
        const txt = await response.text().catch(() => '');
        console.warn('HuggingFace image generation failed:', response.status, txt);
        return null;
      }

      const contentType = response.headers.get('content-type') || 'image/png';
      const ab = await response.arrayBuffer();
      if (!ab || ab.byteLength === 0) return null;
      return toBase64DataUri(ab, contentType.includes('image') ? contentType : 'image/png');
    } catch {
      await sleep(900 * attempt);
    }
  }

  return null;
}

function generateWithPollinations(prompt: string): string {
  const seed = Date.now();
  const encoded = encodeURIComponent(normalizePrompt(prompt));
  return `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=1024&height=1024&seed=${seed}&nologo=true`;
}

export const generateImage = async (prompt: string): Promise<string | null> => {
  const hfImage = await generateWithHuggingFace(prompt);
  if (hfImage) return hfImage;
  return generateWithPollinations(prompt);
};

