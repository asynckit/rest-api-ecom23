import express from 'express'
const router = express.Router()
import { registerController } from '../controllers'


// Creating routes
router.post('/register',registerController.register)

export default router