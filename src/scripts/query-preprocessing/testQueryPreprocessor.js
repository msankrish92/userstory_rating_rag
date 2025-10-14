import { preprocessQuery } from './queryPreprocessor.js';

// Pass "New chat window" as the rawQuery parameter
const result = preprocessQuery("ahc registration", {
    enableAbbreviations: true,
    enableSynonyms: true,
    maxSynonymVariations: 5
});

console.log('Original:', result.original);          // "New chat window"
console.log('Normalized:', result.normalized);      // "new chat window"
console.log('Expanded variations:', result.synonymExpanded);