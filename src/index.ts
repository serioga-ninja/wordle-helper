import { WordWrapper } from './classes/word-wrapper';
import {
  collectBestChoices,
  extractWrongCharacters,
  fillWrongPlacementChars,
  getLetterWeight,
  readLine,
  strToNumberArray
} from './helpres';
import EN_WORDS from './vocabularies/en';

const allWordsCollection: WordWrapper[] = [];

const wordWeight = getLetterWeight(EN_WORDS);
for (const word of EN_WORDS) {
  const wordWrapper = new WordWrapper(word);
  wordWrapper.prepare(wordWeight);

  allWordsCollection.push(wordWrapper);
}

const sortedByWeightWords = allWordsCollection
  .sort((w1, w2) => {
    if (w1.weight > w2.weight) return -1;
    else return 1;
  });

(async () => {
  const bestChoices = collectBestChoices(sortedByWeightWords);
  const mask: string[] = [];
  const availableChars: string[] = [];
  const notExistsLetters: string[] = [];
  const wrongPlacementChars: string[] = [];

  console.log('Best Choices: ');
  for (const bestChoice of bestChoices) {
    console.log(bestChoice.word, bestChoice.weight);
  }

  while (true) {
    console.log('You wrote: ');
    const youWrote = await readLine();
    console.log('Win? (yes/no): ');
    const win = await readLine();
    if (win.toLowerCase() === 'yes') {
      process.exit(0);
    }

    console.log('New letter (empty if none): ');
    const newLetters = await readLine();
    if (newLetters.length > 0) {
      availableChars.push(...newLetters);

      console.log('New correct character position (empty if none): ');
      const newCharPosition = await readLine();
      for (const strNum of [...newCharPosition]) {
        const num = parseInt(strNum);
        mask[num] = youWrote[num];
      }

      fillWrongPlacementChars(youWrote, wrongPlacementChars, [...newLetters], strToNumberArray(newCharPosition));
    }
    notExistsLetters.push(...extractWrongCharacters(youWrote, availableChars));

    console.log('Mask:', mask);
    console.log('AvailableChars:', availableChars);
    console.log('NotExistsLetters:', notExistsLetters);

    console.log('Best Choices: ');
    const bestChoices = collectBestChoices(sortedByWeightWords, {
      availableChars,
      mask,
      notExistsLetters,
      duplicates: true
    });

    for (const bestChoice of bestChoices) {
      console.log(bestChoice.word, bestChoice.weight);
    }
  }
})();


