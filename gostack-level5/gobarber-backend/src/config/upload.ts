import crypto from 'crypto'
import multer, { StorageEngine } from 'multer'
import { resolve } from 'path'

const uploadFolder = resolve(__dirname, '..', '..', 'tmp')

interface IUploadConfig {
  driver: 's3' | 'disk'

  tmpFolder: string
  uploadsFolder: string

  multer: {
    storage: StorageEngine
  }

  config: {
    s3: {
      bucket: string
    }
  }
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',
  tmpFolder: uploadFolder,
  uploadsFolder: resolve(uploadFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: uploadFolder,
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex')
        const fileName = `${fileHash}-${file.originalname}`

        return callback(null, fileName)
      },
    }),
  },

  config: {
    s3: {
      bucket: 'gostack_gobarber',
    },
  },
} as IUploadConfig
