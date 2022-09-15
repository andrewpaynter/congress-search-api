import express, {Request, Response} from 'express'
import Congressperson from '../models/Congressperson'
import fetchCongressData from '../services/fetchCongressData'
import { translateRequestParams, validateRawRequestParams } from '../models/RawRequestParams'
const router = express.Router()

let congressData: Congressperson[] = []
fetchCongressData().then(res => {
  congressData = res
})

router.get('/', async (req: Request, res: Response) => {
  if (!congressData)
    return res.status(503).send()
  if (!validateRawRequestParams(req))
    return res.status(400).send()

  let query = translateRequestParams(req)
  let data = [...congressData]

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
    .header({finalItem: query.offset + query.limit > data.length})
    .status(200)
    .send(data.slice(query.offset, end))
})



module.exports = router
