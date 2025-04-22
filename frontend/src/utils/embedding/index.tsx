import { HfInference } from '@huggingface/inference';

export class HuggingFaceEmbeddings {
    private hf: HfInference;
    private model: string;

    constructor(hfToken: string, model: string = 'thenlper/gte-large') {
        this.hf = new HfInference(hfToken);
        this.model = model;
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        const embeddings = await Promise.all(
            texts.map((text) => this.embedQuery(text))
        );
        return embeddings;
    }

    async embedQuery(text: string): Promise<number[]> {
        try {
            const response = await this.hf.featureExtraction({
                model: this.model,
                inputs: text,
            });

            if (!response || !Array.isArray(response)) {
                throw new Error('Unexpected embedding response format');
            }

            return response as number[]; // assuming 1D array for a single query
        } catch (error) {
            console.error('Error generating embeddings:', error);
            throw error;
        }
    }
}
