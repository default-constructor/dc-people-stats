export class Crime {
  constructor(
      public year: number,
      public key: string,
      public description: string,
      public amountCases: number,
      public amountAttempt: number,
      public amountFirearmThreatend: number,
      public amountFirearmShot: number,
      public amountCaseClosed: number,
      public amountMaleSuspects: number,
      public amountFemaleSuspects: number,
      public amountNonGermanSuspects: number
  ) {}
}

export class CrimeByKey {
  constructor(
      public year: number,
      public key: string,
      public description: string,
      public count: number
  ) {}
}

export class CrimeBySex {
  constructor(
      public year: number,
      public sex: string,
      public count: number
  ) {}
}
