export class WordWrapper {
  weight: number = 0;
  hasDuplicates: boolean;

  constructor(public word: string) {
  }

  prepare(wordWeight: Map<string, number>) {
    this._buildWeight(wordWeight);
    this.hasDuplicates = this._getHasDuplicates();
  }

  avoidAnoOfChars(charList: string[]): boolean {
    return charList.every(ch => !this.word.includes(ch));
  }

  containsAllChars(charsList: string[]): boolean {
    let clone = this.word;

    return charsList.every(ch => {
      const includes = clone.includes(ch);

      if (includes) {
        const aClone = [...clone];
        aClone.splice(clone.indexOf(ch), 1);
        clone = aClone.join('');
      }

      return includes;
    });
  }

  containCharsOnPlaces(mask: string[]): boolean {
    return mask
      .every((ch, i) => i === undefined || this.word[i] === ch);
  }

  private _buildWeight(wordWeight: Map<string, number>) {
    for (const ch of this.word) {
      this.weight += wordWeight.get(ch);
    }
  }

  private _getHasDuplicates(): boolean {
    const uniq = new Set([...this.word]);

    return uniq.size !== this.word.length;
  }
}
