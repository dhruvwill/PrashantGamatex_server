import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { leadinsertquery, getuserIdCategoryIdquery, getleads } from "../queries/lead";

const userRouter = Router();

userRouter.get(
  "/lead/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    const data = await (req as any).knex.raw(  
    getleads
    ,[req.body.user.uid])
    res.json(data)
  }
);

userRouter.patch(
  "/lead/update",
  authenticateJWT,
  setDatabaseConnection,
  async(req:Request,res:Response)=>{
  try {
    const querydata = req.body;
    const userId_categoryId_currencyId_data = await (req as any).knex.raw(
      getuserIdCategoryIdquery,
      [2361, querydata.category, querydata.user.uid,querydata.currency]
    );
    const categoryID = userId_categoryId_currencyId_data[0].CategoryID;
    const userID = userId_categoryId_currencyId_data[0].UserID;
    const currencyID = userId_categoryId_currencyId_data[0].CurrencyID;
    const mode = "UPDATE";
    const params = {
      CompanyName: querydata.user.company,
      FormId: "2361",
      CategoryId: categoryID,
      ScreenName: "Lead Screen",
      UserId: userID,
      CurrencyID: currencyID,
      RecordId: querydata.RecordId,
      UDF_CompanyName_2361: querydata.customerCompanyName,
      UDF_ContactPerson_2361: querydata.contactPerson,
      UDF_Designation_2361: querydata.designation,
      UDF_MobileNo_2361: querydata.mobileNo,
      UDF_EmailId_2361: querydata.emailId,
      UDF_Product_2361: querydata.product,
      UDF_LeadSource_2361: querydata.leadSource,
      UDF_CompetitionWith_2361: querydata.competition,
      UDF_TimeFrame_2361: querydata.timeFrame,
      UDF_LeadRemindDate_2361: querydata.leadRemindDate,
      UDF_CustomerApplication_2361: querydata.customerApplication,
      UDF_CustomerExistingMachine_2361: querydata.customerExistingMachine,
      UDF_LeadNotes_2361: querydata.leadNote,
    };
    console.log(params)
    const data = await (req as any).knex.raw(leadinsertquery, [
      mode,
      params.CompanyName,
      params.FormId,
      params.CategoryId,
      params.ScreenName,
      params.UserId,
      params.RecordId,
      params.CurrencyID,
      params.UDF_CompanyName_2361,
      params.UDF_ContactPerson_2361,
      params.UDF_Designation_2361,
      params.UDF_MobileNo_2361,
      params.UDF_EmailId_2361,
      params.UDF_Product_2361,
      params.UDF_LeadSource_2361,
      params.UDF_CompetitionWith_2361,
      params.UDF_TimeFrame_2361,
      params.UDF_LeadRemindDate_2361,
      params.UDF_CustomerApplication_2361,
      params.UDF_CustomerExistingMachine_2361,
      params.UDF_LeadNotes_2361,
    ])
    if (data[0].Output == 0) {
      throw new Error("Error while updating lead, Please Try again");
    }
    res.status(200).json(data);
  }catch(err:any){
    res.status(500).json({ error: err.message });
  }
})
userRouter.post(
  "/lead/insert",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      console.log(querydata);
      const userId_categoryId_currencyId_data = await (req as any).knex.raw(
        getuserIdCategoryIdquery,
        [2361, querydata.category, querydata.user.uid,querydata.currency]
      );
      console.log(userId_categoryId_currencyId_data);
      const categoryID = userId_categoryId_currencyId_data[0].CategoryID;
      const userID = userId_categoryId_currencyId_data[0].UserID;
      const currencyID = userId_categoryId_currencyId_data[0].CurrencyID;
      const mode = "INSERT";
      const params = {
        CompanyName: querydata.user.company,
        FormId: "2361",
        CategoryId: categoryID,
        ScreenName: "Lead Screen",
        UserId: userID,
        RecordId: 0,
        CurrencyId: currencyID,
        UDF_CompanyName_2361: querydata.customerCompanyName,
        UDF_ContactPerson_2361: querydata.contactPerson,
        UDF_Designation_2361: querydata.designation,
        UDF_MobileNo_2361: querydata.mobileNo,
        UDF_EmailId_2361: querydata.emailId,
        UDF_Product_2361: querydata.product,
        UDF_LeadSource_2361: querydata.leadSource,
        UDF_CompetitionWith_2361: querydata.competition,
        UDF_TimeFrame_2361: querydata.timeFrame,
        UDF_LeadRemindDate_2361: querydata.leadRemindDate,
        UDF_CustomerApplication_2361: querydata.customerApplication,
        UDF_CustomerExistingMachine_2361: querydata.customerExistingMachine,
        UDF_LeadNotes_2361: querydata.leadNote,
      };
      console.log(params);
      const data = await (req as any).knex.raw(leadinsertquery, [
        mode,
        params.CompanyName,
        params.FormId,
        params.CategoryId,
        params.ScreenName,
        params.UserId,
        params.RecordId,
        params.CurrencyId,
        params.UDF_CompanyName_2361,
        params.UDF_ContactPerson_2361,
        params.UDF_Designation_2361,
        params.UDF_MobileNo_2361,
        params.UDF_EmailId_2361,
        params.UDF_Product_2361,
        params.UDF_LeadSource_2361,
        params.UDF_CompetitionWith_2361,
        params.UDF_TimeFrame_2361,
        params.UDF_LeadRemindDate_2361,
        params.UDF_CustomerApplication_2361,
        params.UDF_CustomerExistingMachine_2361,
        params.UDF_LeadNotes_2361,
      ]);
      if (data[0].Output == 0) {
        throw new Error("Error while inserting lead, Please Try again");
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default userRouter;
