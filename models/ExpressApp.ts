import express from 'express'

export default interface ExpressApp extends Express.Application {
  use: Function
}