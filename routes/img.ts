import express, {Request, Response} from 'express'
import fs from 'fs'
import sharp from 'sharp'
import NodeCache from 'node-cache'
import axios from "axios";
const myCache = new NodeCache()

const router = express.Router()

router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  if (!myCache.has(id)) {
    try {
      const input = (await axios({ url: `https://theunitedstates.io/images/congress/450x550/${id}.jpg`,
        responseType: "arraybuffer" })).data as Buffer
      const img = await sharp(input)
        .resize(450, 550)
        .webp()
        .toBuffer()
  
      myCache.set(id, img)
    } catch(e) {
      return res.status(404).send()
    }
  }
  res.status(200).send(myCache.get(id))
})


module.exports = router
