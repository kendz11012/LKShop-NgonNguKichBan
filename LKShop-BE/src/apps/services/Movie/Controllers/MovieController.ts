import { Request, Response, NextFunction } from "express";
import { BadRequest, BaseResponse } from '../../../../common/base.response'
import Movie from "../DTO/Movie";
import Router from '../../../../decorators/routes.decorator';
import extractJWT from "../../../middlewares/extractJWT";
import upload from "../../../middlewares/uploadImage";
import { getAllMovieHandler, getMovieByIdHandler, createMovieHandler, updateMovieHandler, deleteMovieHandler } from '../Repositories/MovieRepository'
import validationMiddleware from "../../../middlewares/validation";
import MovieFilter from "../DTO/MovieFilter";
import MovieCreate from "../DTO/MovieCreate";
import MovieUpdate from "../DTO/MovieUpdate";
import HttpException from "../../../../Exceptions/HttpException";

const baseUrl = "api/v1/Movie"

export class MovieController {
    @Router({
        path: `/${baseUrl}/GetAllMovie`,
        method: 'get',
        middlewares: [extractJWT, validationMiddleware(MovieFilter)]
    })
    private async GetAllMovie(req: Request, res: Response, next: NextFunction) {
        try {
            const movies = await getAllMovieHandler(req.body);
            return res.status(200).send(new BaseResponse<Movie[]>(movies, "Get Success", true))
        }
        catch (error) {
            console.log(error)
        }
    }

    @Router({
        path: `/${baseUrl}/GetMovieById/:MovieId`,
        method: 'get',
        middlewares: [extractJWT]
    })
    private async GetAllMovieById(req: Request, res: Response, next: NextFunction) {
        try {
            const { MovieId } = req.params;
            const Movie = await getMovieByIdHandler(MovieId);
            return res.status(200).send(new BaseResponse<Movie>(Movie, "Get Success", true))
        }
        catch (error) {
            console.log(error)
        }

    }

    @Router({
        path: `/${baseUrl}/CreateMovie`,
        method: 'post',
        middlewares: [extractJWT, validationMiddleware(MovieCreate)]
    })
    private async CreateMovie(req: Request, res: Response, next: NextFunction) {
        const response = await createMovieHandler(req.body);
        if (!response) {
            return next(new HttpException(400, response.msgString))
        }
        else {
            return res.status(201).send({
                isSuccess: response.isSuccess,
                message: response.msgString
            })
        }
    }

    @Router({
        path: `/${baseUrl}/UpdateMovie/:MovieId`,
        method: 'put',
        middlewares: [extractJWT, validationMiddleware(MovieUpdate)]
    })
    private async UpdateMovie(req: Request, res: Response, next: NextFunction) {
        const { MovieId } = req.params
        const Movie = await updateMovieHandler(MovieId, req.body)
        return res.status(200).send({
            isSuccess: true,
            msgString: "Update Success"
        })
    }

    @Router({
        path: `/${baseUrl}/DeleteMovie/:MovieId`,
        method: 'delete',
        middlewares: [extractJWT]
    })
    private async DeleteMovie(req: Request, res: Response, next: NextFunction) {
        const { MovieId } = req.params
        await deleteMovieHandler(MovieId)
        return res.status(200).send({
            isSuccess: true,
            msgString: "Delete Success"
        })
    }
}