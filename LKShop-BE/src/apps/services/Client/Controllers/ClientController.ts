import { getListClientHandler, createClientHandler, updateClientHandler, deleteClientHandler, getClientByIdHandler, changeAvatarHandler, checkPasswordClientHandler } from "../Repositories/ClientRepository";
import e, { NextFunction, Request, Response } from 'express'
import { BadRequest, BaseResponse } from '../../../../common/base.response'
import Router from '../../../../decorators/routes.decorator';
import extractJWT from "../../../middlewares/extractJWT";
import upload from "../../../middlewares/uploadImage";
import Client from "../DTO/Client";
import validationMiddleware from "../../../middlewares/validation";
import ClientFilter from "../DTO/ClientFilter";
import ClientCreate from "../DTO/ClientCreate";
import ClientUpdate from "../DTO/ClientUpdate";
import HttpException from "../../../../Exceptions/HttpException";

const baseUrl = "api/v1/Client"

export class ClientController {


    @Router({
        path: `/${baseUrl}/GetAllClient`,
        method: 'get',
        middlewares: [extractJWT, validationMiddleware(ClientFilter)]
    })
    private async getListClient(req: Request, res: Response, next: NextFunction) {
        const clients = await getListClientHandler(req.body);
        return res.status(200).send(new BaseResponse<Client[]>(clients, "Get Success", true))
    }



    @Router({
        path: `/${baseUrl}/GetClientById/:ClientId`,
        method: 'get',
        middlewares: [extractJWT]
    })
    private async getClientById(req: Request, res: Response) {
        const { ClientId } = req.params;
        const Client = await getClientByIdHandler(ClientId);
        return res.status(200).send(new BaseResponse<Client>(Client, "Get Success", true))
    }



    @Router({
        path: `/${baseUrl}/createClient`,
        method: 'post',
        middlewares: [extractJWT, upload.single("ClientAvatar"), validationMiddleware(ClientCreate)]
    })
    private async createClient(req: Request, res: Response, next: NextFunction) {
        console.log(req.body)
        const Response = await createClientHandler(req.body, req.file);
        if (!Response.isSuccess) {
            next(new HttpException(400, Response.msgString))
        }
        else {
            return res.status(201).send({
                isSuccess: Response.isSuccess,
                msgString: Response.msgString
            })
        }

    }



    @Router({
        path: `/${baseUrl}/updateClient/:ClientId`,
        method: 'put',
        middlewares: [extractJWT, upload.single("ClientAvatar"), validationMiddleware(ClientUpdate)]
    })
    private async updateClient(req: Request, res: Response) {
        const { ClientId } = req.params
        const Client = await updateClientHandler(ClientId, req.body, req.file)
        return res.status(200).send({
            isSuccess: true,
            msgString: "Update Success"
        })
    }



    @Router({
        path: `/${baseUrl}/deleteClient/:ClientId`,
        method: 'delete',
        middlewares: [extractJWT]
    })
    private async deleteClient(req: Request, res: Response) {
        const { ClientId } = req.params
        await deleteClientHandler(ClientId)
        return res.status(200).send({
            isSuccess: true,
            msgString: "Delete Success"
        })
    }



    @Router({
        path: `/${baseUrl}/changeAvatar`,
        method: 'put',
        middlewares: [extractJWT, upload.single("ClientAvatar")]
    })
    private async changeAvatar(req: Request, res: Response) {
        await changeAvatarHandler(req.body, req.file)
        return res.status(200).send({
            isSuccess: true,
            msgString: "Change Avatar success"
        })
    }

    @Router({
        path: `/${baseUrl}/ChangePassword/:ClientId`,
        method: 'put',
        middlewares: [extractJWT]
    })
    private async changePasswordClient(req: Request, res: Response) {
        const { ClientId } = req.params
        const { Id, Password, NewPassword } = req.body
        const response = await checkPasswordClientHandler(Id, Password)
        const ClientUpdate = {
            ...req.body,
            Id: Id,
            Password: NewPassword,
        }
        if (response.isSucces == true) {
            await updateClientHandler(ClientId, ClientUpdate, req.file)
            return res.status(200).send({
                isSuccess: true,
                msgString: "Change Password Success"
            })
        }
        else {
            return res.status(200).send({
                isSuccess: response.isSucces,
                msgString: response.msgString
            })
        }

    }
}
