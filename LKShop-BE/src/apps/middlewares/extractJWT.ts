import { Request, Response, NextFunction } from 'express'
import log from "../logger";
import jwt from 'jsonwebtoken'
import config from 'config'

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    log.info("Validating Token");
    let token = req.headers.authorization.split(' ')[1];
    if (token) {
        jwt.verify(token, config.get("app.token.SERVER_TOKEN_SECRET"), (error, decoded) => {
            if (error) {
                return res.status(404).json({
                    message: error.message,
                    error
                })
            }
            else {
                res.locals.jwt = decoded;
                next()
            }
        })
    }
    else {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}

export default extractJWT