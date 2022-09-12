import express, {Request, Response} from 'express'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import fs from 'fs'

const router = express.Router()

router.get('/:id', async (req: Request, res: Response) => {
  //if path does not exist, grab image and convert to webp and save, then return
  const id = req.params.id
  if (!fs.existsSync(`../cache-images/${id}.webp`)) {
    //grab image and convert to webp. save at appropriate url
    await imagemin([`https://theunitedstates.io/images/congress/450x550/${id}.jpg`], {
      destination: '../cache-images',
      plugins: [imageminWebp({quality: 50})]
    })
  }
  //if path exists, return the image as a stream

})


module.exports = router
