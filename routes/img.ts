import express, {Request, Response} from 'express'
import sharp from 'sharp'
import NodeCache from 'node-cache'
import axios from "axios";
const imgCache = new NodeCache()

const router = express.Router()

router.get('/:id', async (req: Request, res: Response) => {
  let id = req.params.id
  if (!imgCache.has(id)) {
    try {
      const input = (await axios({ url: `https://theunitedstates.io/images/congress/450x550/${id}.jpg`,
        responseType: "arraybuffer" })).data as Buffer
      const img = await sharp(input)
        .resize(450, 550)
        .webp()
        .toBuffer()
  
      imgCache.set(id, img)
    } catch(e) {
      try {
        const input = (await axios({ url: 'https://via.placeholder.com/450x550.jpg',
          responseType: "arraybuffer" })).data as Buffer
        const img = await sharp(input)
          .resize(450, 550)
          .webp()
          .toBuffer()
        id = 'error'
        imgCache.set(id, img)
      } catch (e) {
        return res.status(400).send()
      }
    }
  }
  res.header({'Content-Type': 'image/webp'}).status(200).send(imgCache.get(id))
})


module.exports = router
