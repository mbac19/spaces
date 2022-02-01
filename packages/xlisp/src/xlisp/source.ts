export class SourceIterator implements Iterator<string> {
  private offset: number = 0;

  private readonly result: IteratorResult<string> = { done: false, value: "" };

  public get isDone(): boolean {
    return this.offset >= this.tokens.length;
  }

  constructor(private readonly tokens: Array<string>) {}

  public peek(): IteratorResult<string> {
    this.result.done = this.isDone;
    this.result.value = this.tokens[this.offset];
    return this.result;
  }

  public shift() {
    this.offset += 1;
  }

  public next(): IteratorResult<string> {
    const result = this.peek();

    if (!result.done) {
      this.offset += 1;
    }

    return result;
  }
}

export class Source implements Iterable<string> {
  private readonly tokens: Array<string>;

  constructor(private readonly raw: string) {
    this.tokens = tokenize(raw);
  }

  public [Symbol.iterator]() {
    return this.iter();
  }

  public iter(): SourceIterator {
    return new SourceIterator(this.tokens);
  }
}

function tokenize(raw: string): Array<string> {
  const tokens: Array<string> = [];

  for (const line of raw.split(/\n/)) {
    // TODO: Need support for quote escaping.
    const splitByQuotes = line.split('"');
    const removeComments = [];

    if (splitByQuotes.length % 2 === 0) {
      throw Error("Unbalanced quotes");
    }

    for (let i = 0; i < splitByQuotes.length; ++i) {
      const next = splitByQuotes[i];

      if (i % 2 === 1) {
        // in string.
        removeComments.push(next.replace(/ /g, "!whitespace!"));
        continue;
      }

      // not in string
      const splitByComment = next
        .replace(/\(/g, " ( ")
        .replace(/\)/g, " ) ")
        .split(";;");

      removeComments.push(splitByComment[0]);

      if (splitByComment.length > 1) {
        // We are commenting out from this point on.
        break;
      }
    }

    tokens.push(
      ...removeComments
        .join('"')
        .trim()
        .split(/\s+/)
        .map((x) => x.replace(/!whitespace!/g, " "))
    );
  }

  return tokens.filter(Boolean);
}
