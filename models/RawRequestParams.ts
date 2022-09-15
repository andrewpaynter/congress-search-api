import {Request} from 'express'
import RequestParams from './RequestParams'

export interface RawRequestParams {
  currPage: string,
  limit: string,
  offset: string,
  sortBy: 'name' | 'title' | 'party' | 'state' | 'yearsServed',
  sortReverse: string,
  filter: string
}

export const translateRequestParams = (req: Request) => {
  return <RequestParams> {
    currPage: <number> parseInt(<string>req.query.currPage),
    limit: <number> parseInt(<string>req.query.limit),
    offset: <number> parseInt(<string>req.query.offset),
    sortBy: <'name' | 'title' | 'party' | 'state' | 'yearsServed'> req.query.sortBy,
    sortReverse: <boolean> (req.query.sortReverse === 'true'),
    filter: <string>req.query.filter
    }
}

export const validateRawRequestParams = (req: Request): boolean => {
  let validSortBy = ['name', 'title', 'party', 'state', 'yearsServed']
  let isValid =  (typeof req.query.currPage === 'string' &&
    typeof req.query.limit === 'string' &&
    typeof req.query.offset === 'string' &&
    typeof req.query.sortBy === 'string' &&
    validSortBy.includes(req.query.sortBy) &&
    typeof req.query.sortReverse === 'string' &&
    typeof req.query.filter === 'string'
    )
  return isValid
}