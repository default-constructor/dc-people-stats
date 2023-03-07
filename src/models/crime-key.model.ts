export class CrimeKey {
  constructor(
      public key: string,
      public description: string,
      public year: number,
      public oldVersion: CrimeKey
  ) {}
}
