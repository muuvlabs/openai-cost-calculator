const {
  calculateLanguageModelCost,
  calculateFineTuningModelCost,
  calculateEmbeddingModelCost,
  calculateImageModelCost,
  calculateAudioModelCost
} = require('../index');

describe('OpenAI Cost Calculator', () => {
  test('calculateLanguageModelCost for GPT-4', () => {
    const result = calculateLanguageModelCost('gpt-4', { promptTokens: 100, completionTokens: 50 });
    expect(result.promptCost).toBeCloseTo(0.003, 5);
    expect(result.completionCost).toBeCloseTo(0.003, 5);
    expect(result.totalCost).toBeCloseTo(0.006, 5);
    expect(result.formattedTotalCost).toBe('$0.006');
  });

  test('calculateFineTuningModelCost for Ada', () => {
    const result = calculateFineTuningModelCost('babbage-002', 1000, 'training');
    expect(result.totalCost).toBeCloseTo(0.4, 5);
    expect(result.formattedTotalCost).toBe('$0.40');
  });

  test('calculateEmbeddingModelCost for Ada', () => {
    const result = calculateEmbeddingModelCost('text-embedding-ada-002', 1000);
    expect(result.totalCost).toBeCloseTo(0.1, 5);
    expect(result.formattedTotalCost).toBe('$0.10');
  });

  test('calculateImageModelCost for 1024x1024', () => {
      const result = calculateImageModelCost('dall-e-3', 1024, 1024, 5);
    expect(result.totalCost).toBeCloseTo(0.2, 5);
    expect(result.formattedTotalCost).toBe('$0.20');
  });

  test('calculateAudioModelCost for Whisper', () => {
    const result = calculateAudioModelCost('whisper', 10);
    expect(result.totalCost).toBeCloseTo(0.06, 5);
    expect(result.formattedTotalCost).toBe('$0.06');
  });

  test('Unknown model throws error', () => {
    expect(() => {
      calculateLanguageModelCost('unknown-model', { promptTokens: 100, completionTokens: 50 });
    }).toThrow('Unknown model `unknown-model`, Did you mean');
  });
});
