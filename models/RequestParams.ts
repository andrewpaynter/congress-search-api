import Congressperson from "./Congressperson";

export default interface RequestParams {
  currPage: number,
  limit: number,
  offset: number,
  sortBy: keyof Congressperson,
  filter: string
}