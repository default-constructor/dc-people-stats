export class Refugees {
  constructor(
      public referenceDate: string,
      public country: string,
      public age: number,
      public sex: string,
      public count: number
  ) {}
}

export class RefugeesByAge {
  constructor(
      public year: number,
      public age: number,
      public count: number
  ) {}
}

export class RefugeesByCountry {
  constructor(
      public year: number,
      public country: string,
      public count: number
  ) {}
}

export class RefugeesBySex {
  constructor(
      public year: number,
      public sex: string,
      public count: number
  ) {}
}
