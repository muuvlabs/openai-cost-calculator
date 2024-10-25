const prices = require('./prices.json');
const { didYouMean } = require('./suggester');

function formattedTotalCost(totalCost) {
    if(totalCost < 0.001) {
        return "$" + totalCost.toFixed(4);
    } else if(totalCost < 0.01) {
        // Round up to the nearest cent if the cost is close
        return "$" + totalCost.toFixed(3);
    } else {
        return "$" + totalCost.toFixed(2);
    }
}

const calculateLanguageModelCost = (modelName, {promptTokens, completionTokens}) => {
    modelName = modelName.toLowerCase();
    let pricePerToken = prices.models[modelName]
    if (pricePerToken == null) {
      // Closest other model find
        throw new Error('Unknown model `' + modelName+"`, Did you mean `"+ didYouMean(modelName, Object.keys(prices.models))+"`?");
    }
    if(!promptTokens) promptTokens = 0;
    if(!completionTokens) completionTokens = 0;
    promptTokens /= 1000;
    completionTokens /= 1000;
    const promptCost = pricePerToken["input"] * promptTokens;
    const completionCost = pricePerToken["output"] * completionTokens;
    const totalCost = promptCost + completionCost;
    return {
        promptCost,
        completionCost,
        totalCost,
        formattedTotalCost: formattedTotalCost(totalCost)
    }
}

const calculateFineTuningModelCost = (modelName, tokens, operation) => {
    modelName = modelName.toLowerCase();
    let pricePerToken = prices["fine-tuning"][modelName]
        ? prices["fine-tuning"][modelName][operation]
        : null;
    if (pricePerToken == null) {
        throw new Error('Unknown model');
    }
    const totalCost = pricePerToken * tokens;
    return {
        totalCost,
        formattedTotalCost: formattedTotalCost(totalCost)
    };
}

const calculateEmbeddingModelCost = (modelName, tokens) => {
    modelName = modelName.toLowerCase();
    let pricePerToken = prices["embedding"][modelName]
        ? prices["embedding"][modelName]
        : null;
    if (pricePerToken == null) {
        throw new Error('Unknown model');
    }
    const totalCost = pricePerToken * tokens;
    return {
        totalCost,
        formattedTotalCost: formattedTotalCost(totalCost)
    };
}


const calculateImageModelCost = (model, width, height, images, quality = "standard") => {
    let pricePerImage = prices["image"][model][`${quality}-${width}-${height}`];
    const totalCost = pricePerImage * images;
    return {
        totalCost,
        formattedTotalCost: formattedTotalCost(totalCost)
    };
}

const calculateAudioModelCost = (modelName, minutes) => {
    modelName = modelName.toLowerCase();
    let pricePerMinute = prices["audio"][modelName]
        ? prices["audio"][modelName]
        : null;
    if (pricePerMinute == null) {
        throw new Error('Unknown model');
    }
    const totalCost = pricePerMinute * minutes;
    return {
        totalCost,
        formattedTotalCost: formattedTotalCost(totalCost)
    };
}

module.exports = {
    calculateLanguageModelCost,
    calculateFineTuningModelCost,
    calculateEmbeddingModelCost,
    calculateImageModelCost,
    calculateAudioModelCost
}
