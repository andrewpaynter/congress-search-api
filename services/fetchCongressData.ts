import Congressperson from "../models/Congressperson"
import RawCpData from "../models/RawCpData"

function request<TResponse> (
  url: string,
  config: RequestInit
): Promise<TResponse> {
  return fetch(url, config)
    .then(res => res.json())
    .then(data => data as TResponse)
}

export default async function () {
  try {
    let data = await request<RawCpData[]>(
      'https://theunitedstates.io/congress-legislators/legislators-current.json',
      {method: 'GET'})
    let congressData: Congressperson[] = data.map(cp => {
      let recentTermData = cp.terms[cp.terms.length - 1]
      let ncp: Congressperson = {
        id: cp.id.bioguide,
        name: cp.name.official_full || '',
        title: recentTermData.type === 'rep' ? 'Representative' : 'Senator',
        party: recentTermData.party,
        state: recentTermData.state,
        yearsServed: new Date().getFullYear() - parseInt(cp.terms[0].start.slice(0, 4))
      }
      return ncp
    })
    return congressData
  } catch (e) {
    throw new Error
  }
}