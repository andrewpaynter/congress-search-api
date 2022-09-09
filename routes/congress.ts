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
try {
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
          yearsServed: new Date().getFullYear() - parseInt(cp.terms[0].start.slice(0, 4))
        }
        return ncp
      })
    })
} catch (e) {
  console.log(e)
}
  


router.get('/', async (req: Request, res: Response) => {
  let query: RequestParams = {
    currPage: parseInt(<string>req.query.currPage),
    limit: parseInt(<string>req.query.limit),
    offset: parseInt(<string>req.query.offset),
    sortBy: <keyof Congressperson>req.query.sortBy,
    filter: <string>req.query.filter
    }
  let data: Congressperson[] = [...congressData]
  // if (query.filter.length > 0) {
  //   //Filter data
  // }

  data.sort((a, b) => <any>a[query.sortBy] - <any>b[query.sortBy])
  res.send(data.slice(query.offset, query.offset + query.limit))
})

module.exports = router
