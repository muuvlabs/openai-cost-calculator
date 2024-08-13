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
    const result = calculateFineTuningModelCost('ada', 1000, 'Training');
    expect(result.totalCost).toBeCloseTo(0.4, 5);
    expect(result.formattedTotalCost).toBe('$0.40');
  });

  test('calculateEmbeddingModelCost for Ada', () => {
    const result = calculateEmbeddingModelCost('ada', 1000);
    expect(result.totalCost).toBeCloseTo(0.1, 5);
    expect(result.formattedTotalCost).toBe('$0.10');
  });

  test('calculateImageModelCost for 1024x1024', () => {
    const result = calculateImageModelCost('1024x1024', 5);
    expect(result.totalCost).toBeCloseTo(0.1, 5);
    expect(result.formattedTotalCost).toBe('$0.10');
  });

  test('calculateAudioModelCost for Whisper', () => {
    const result = calculateAudioModelCost('whisper-1', 10);
    expect(result.totalCost).toBeCloseTo(0.06, 5);
    expect(result.formattedTotalCost).toBe('$0.06');
  });

  test('Unknown model throws error', () => {
    expect(() => {
      calculateLanguageModelCost('unknown-model', { promptTokens: 100, completionTokens: 50 });
    }).toThrow('Unknown model `unknown-model`, Did you mean');
  });
});
