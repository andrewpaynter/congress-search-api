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
  if (!congressData) {
    return res.status(503).send()
  }
  let query: RequestParams
  if (validateInput(req)) {
     query = {
      currPage: parseInt(<string>req.query.currPage),
      limit: parseInt(<string>req.query.limit),
      offset: parseInt(<string>req.query.offset),
      sortBy: <keyof Congressperson>req.query.sortBy,
      filter: <string>req.query.filter
      }
  } else {
    return res.status(400).send()
  }
  
  let data: Congressperson[] = [...congressData]
  if (query.filter.length > 0) {
    console.log(query.filter)
    data = data.filter(cp => {
      return cp.name.toLowerCase().includes(query.filter.toLowerCase())
    })
  }

  data.sort((a, b) => <any>a[query.sortBy] - <any>b[query.sortBy])
  res.send(data.slice(query.offset, query.offset + query.limit))
})

const validateInput = (req: Request): boolean => {
    let validSortBy = ['id', 'image', 'name', 'title', 'party', 'state', 'yearsServed']
    let isValid =  (typeof req.query.currPage === 'string' &&
      typeof req.query.limit === 'string' &&
      typeof req.query.offset === 'string' &&
      typeof req.query.sortBy === 'string' &&
      validSortBy.includes(req.query.sortBy) &&
      typeof req.query.filter === 'string'
      )
    return isValid
}

module.exports = router
