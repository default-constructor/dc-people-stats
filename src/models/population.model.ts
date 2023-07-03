export class Population {
  constructor(
      public year: string,
      public sex: string,
      public age: number,
      public countInThousand: number
  ) {}
}

export class PopulationByAgeAndSex {
  constructor(
      public year: string,
      public age: number,
      public sex: string,
      public count: number
  ) {}
}
