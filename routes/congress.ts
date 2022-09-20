import express, {Request, Response} from 'express'
import Congressperson from '../models/Congressperson'
import RawCpData from '../models/RawCpData'
import { translateRequestParams, validateRawRequestParams } from '../models/RawRequestParams'
const router = express.Router()

let congressData: Congressperson[]

function request<TResponse> (
  url: string,
  config: RequestInit
): Promise<TResponse> {
  return fetch(url, config)
    .then(res => res.json())
    .then(data => data as TResponse)
}

try {
  request<RawCpData[]>(
    'https://theunitedstates.io/congress-legislators/legislators-current.json',
    {method: 'GET'})
    .then(data => {
      congressData = data.map(cp => {
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
    })
} catch (e) {
  console.log(e)
}
  


router.get('/', async (req: Request, res: Response) => {
  if (!congressData)
    return res.status(503).send()
  if (!validateRawRequestParams(req))
    return res.status(400).send()
    
  let query = translateRequestParams(req)
  let data: Congressperson[] = [...congressData]

  if (query.filter.length > 0) {
    data = data.filter(cp => {
      return cp.name.toLowerCase().includes(query.filter.toLowerCase())
    })
  }
  data.sort((a, b) => {
    let nameA = a[query.sortBy]
      if (typeof nameA === 'string') nameA = nameA.toUpperCase()
    let nameB = b[query.sortBy]
      if (typeof nameB === 'string') nameB = nameB.toUpperCase()
    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
  })
  if (query.sortReverse) data.reverse()

  let end = query.offset + query.limit < data.length? query.offset + query.limit : data.length
  res
  .header({'Content-Type': 'application/json',
    finalItem: query.offset + query.limit > data.length})
  .status(200)
  .send(data.slice(query.offset, end))
})



module.exports = router
