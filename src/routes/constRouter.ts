import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { constantsquery, getdocumentnofollowupquery, getdocumentnoleadquery } from "../queries/constants";
import { authenticateJWT } from "../middleware/authenticateJWT";

const constRouter = Router()

constRouter.get("/get",authenticateJWT,setDatabaseConnection,async (req: Request, res: Response) => {
    try{
        const params = {
        LeadSource: "LeadSource",
        Category: "Category",
        TimeFrame: "TimeFrame",
        Currency: "Currency"
    }
        const data = await (req as any).knex.raw(constantsquery,[
        params.LeadSource,
        params.TimeFrame,
        params.Currency,
        params.Category
    ])
        res.json(data)
    }catch(err:any){
        res.status(500).json({message:err.message})
    }
})

constRouter.get("/get/documentno/followup",authenticateJWT,setDatabaseConnection,async (req: Request, res: Response) => {
    try{
        const data = await (req as any).knex.raw(getdocumentnofollowupquery,[req.query.CategoryId,req.query.DocumentNo])
        res.status(200).json(data)
    }catch(err:any){
        res.status(500).json({message:err.message})
    }
})

constRouter.get("/get/documentno/lead",authenticateJWT,setDatabaseConnection,async (req: Request, res: Response) => {
    try{
        const data = await (req as any).knex.raw(getdocumentnoleadquery,[req.query.CategoryId,req.query.DocumentNo])
        res.status(200).json(data)
    }catch(err:any){
        res.status(500).json({message:err.message})
    }
})

export default constRouter