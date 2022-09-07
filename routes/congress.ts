import express, {Request, Response} from 'express'
import Congressperson from '../models/Congressperson'
import RawCpData from '../models/RawCpData'
import RequestParams from '../models/RequestParams'
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

  request<RawCpData[]>(
    'https://theunitedstates.io/congress-legislators/legislators-current.json',
    {method: 'GET'})
    .then(data => {
      congressData = data.map(cp => {
        let recentTermData = cp.terms[cp.terms.length - 1]
        let ncp: Congressperson = {
          id: cp.id.bioguide,
          name: cp.name.official_full,
          title: recentTermData.type === 'rep' ? 'Representative' : 'Senator',
          party: recentTermData.party,
          state: recentTermData.state,
          yearsServed: parseInt(cp.terms[0].start.slice(0, 3))
        }
        return ncp
      })
    })


router.get('/', async (req: Request <RequestParams>, res: Response) => {
  let data: Congressperson[] = [...congressData]
  if (req.params.filter.length > 0) {
    //Filter data
  }

  let sortBy: keyof Congressperson = req.params.sortBy
  //data.sort((a, b) => a[sortBy] - b[sortBy])

  res.send(data.slice(req.params.offset, req.params.offset + req.params.limit))
})

module.exports = router
