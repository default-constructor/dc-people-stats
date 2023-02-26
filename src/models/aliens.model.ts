export class Aliens {
  constructor(
      public referenceDate: string,
      public country: string,
      public age: number,
      public sex: string,
      public count: number
  ) {}
}

export class AliensByAge {
  constructor(
      public year: number,
      public age: number,
      public count: number
  ) {}
}

export class AliensByCountry {
  constructor(
      public year: number,
      public country: string,
      public count: number
  ) {}
}

export class AliensBySex {
  constructor(
      public year: number,
      public sex: string,
      public count: number
  ) {}
}
