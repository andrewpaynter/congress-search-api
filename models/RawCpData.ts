interface IId {
  bioguide: string
}
interface IName {
  official_full: string
}
interface ITerms {
  type: string,
  start: string,
  end: string,
  state: string,
  party: string
}

export default interface RawCpData {
  id: IId,
  name: IName,
  terms: ITerms[]
}