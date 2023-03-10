import Joi from "joi"
import { User } from '../../models';
import bcrypt from 'bcrypt';
import JwtService from '../../services/jwtService'
import CustomErrorHandler from "../../services/CustomErrorHandler";

const registerController = {
    async register(req, res, next){
        // logic goes here
        
        // Validation
        const registerSchema  =Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        })
        console.log(req.body)
        const {error} = registerSchema.validate(req.body)
        if(error){
            return next(error)
            
        }
        // res.json({msg:"Hello from express"})

        // check if user is in the database already

        try{
            const exist  = await User.exists({email: req.body.email})
            if(exist){
                return next(CustomErrorHandler.alreadyExist("This email is already taken"));
            }
        }catch(err){
            return next(err);
        }
        const {name, email, password} = req.body;
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10)

        // prepare the model
        
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        let access_token;
        try{
            const result = await user.save()
            console.log(result)
            // Token
             access_token = JwtService.sign({_id: result._id, role: result.role})

        }catch(err){
            return next(err);
        }
        res.json({access_token: access_token})
    }
}

export default registerController;