import { Buffer } from 'buffer';
import { stdin } from 'process';
import { WordWrapper } from './classes/word-wrapper';

export function getLetterWeight(wordList: string[]): Map<string, number> {
  const res = new Map<string, number>();
  const joinedWordList = wordList.join('');

  for (const ch of joinedWordList) {
    if (!res.has(ch)) {
      res.set(ch, 0);
    }

    res.set(
      ch,
      res.get(ch) + 1
    );
  }

  return res;
}

export function readLine(): Promise<string> {
  return new Promise<string>(resolve => {
    stdin.once('data', (buff: Buffer) => {
      resolve(buff.toString('utf-8').replace(/\r\n/g, ''));
    });
  });
}

export function clearScreen() {
  const lines = process.stdout.getWindowSize()[1];
  for (let i = 0; i < lines; i++) {
    console.log('\r\n');
  }
}

export interface ICollectBestChoicesOptions {
  availableChars?: string[];
  mask?: string[];
  notExistsLetters?: string[];
  duplicates?: boolean;
  limit?: number;
}

export function collectBestChoices(wWrappers: WordWrapper[], options: ICollectBestChoicesOptions = {}): WordWrapper[] {
  const { mask = [], notExistsLetters = [], availableChars = [], duplicates = false, limit = 10 } = options;
  let res = wWrappers;
  if (!duplicates) res = res.filter(w => !w.hasDuplicates);

  res = wordListWithoutCharacters(
    res,
    notExistsLetters
  );
  res = wordListWithCharacters(
    res,
    availableChars
  );

  return wordListWithCharactersOnPlaces(res, mask).slice(0, limit);
}

export function wordListWithCharacters(wWrappers: WordWrapper[], availableChars: string[]): WordWrapper[] {
  if (availableChars.length === 0) return wWrappers;

  return wWrappers.filter(ww => ww.containsAllChars(availableChars));
}

export function wordListWithoutCharacters(wWrappers: WordWrapper[], availableChars: string[]): WordWrapper[] {
  if (availableChars.length === 0) return wWrappers;

  return wWrappers.filter(ww => ww.avoidAnoOfChars(availableChars));
}

export function wordListWithCharactersOnPlaces(wWrappers: WordWrapper[], mask: string[]): WordWrapper[] {
  if (mask.length === 0) return wWrappers;

  return wWrappers.filter(ww => ww.containCharsOnPlaces(mask));
}

export function extractWrongCharacters(word: string, availableChars: string[]): string[] {
  const aWord = [...word];

  return [...word].filter(ch => !availableChars.includes(ch))
}

export function hasDuplicates(aStr: string[]): boolean {
  return new Set(aStr).size !== aStr.length;
}

// TODO
export function fillWrongPlacementChars(youWrote: string,
                                        wrongPlacementChars: string[],
                                        newChars: string[],
                                        correctPlacements: number[]) {
  const excludeChars = correctPlacements.map(n => youWrote[n]);
  newChars
    .filter(ch => !excludeChars.includes(ch))
    .forEach(ch => {

    });

}

export function strToNumberArray(str: string): number[] {
  return [...str].map(ch => parseInt(ch));
}
