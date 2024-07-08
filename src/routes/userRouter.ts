import { Router, Request, Response } from "express";
import { setDatabaseConnection } from "../middleware/setDatabase";
import { authenticateJWT } from "../middleware/authenticateJWT";
import {
  leadinsertquery,
  getuserIdCategoryIdquery,
  getleads,
} from "../queries/lead";
import {
  getfollowupinquiry,
  getfollowupquotation,
  followupinquiryinsertquery,
  followupquotationinsertquery,
  getUseridCategoryidfollowup
} from "../queries/followup";

const userRouter = Router();

userRouter.get(
  "/lead/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    const data = await (req as any).knex.raw(getleads, [req.body.user.uid]);
    res.json(data);
  }
);

userRouter.patch(
  "/lead/update",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      const userId_categoryId_currencyId_data = await (req as any).knex.raw(
        getuserIdCategoryIdquery,
        [2361, querydata.category, querydata.user.uid, querydata.currency]
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
      console.log(params);
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
      ]);
      if (data[0].Output == 0) {
        throw new Error("Error while updating lead, Please Try again");
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);
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
        [2361, querydata.category, querydata.user.uid, querydata.currency]
      );
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
      res.status(500).json({ error: "An unexpected Error Occured" });
    }
  }
);

userRouter.get(
  "/followup/inquiry/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    const data = await (req as any).knex.raw(getfollowupinquiry, [
      req.body.user.uid,
    ]);
    res.json(data);
  }
);

userRouter.get(
  "/followup/quotation/get",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    const data = await (req as any).knex.raw(getfollowupquotation, [
      req.body.user.uid,
    ]);
    res.json(data);
  }
);

userRouter.post(
  "/followup/inquiry/insert",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      const userId_categoryId = await (req as any).knex.raw(
        getUseridCategoryidfollowup,
        [206, querydata.category, querydata.user.uid]
      );
      const categoryID = userId_categoryId[0].CategoryId;
      const userID = userId_categoryId[1].Userid;
      const mode = "INSERT";
      const params = {
        Mode: mode,
        SalesInquiryId: querydata.SalesInquiryId,
        SalesInquiryDetailsId: querydata.SalesInquiryDetailsId,
        CategoryId: categoryID,
        UserId: userID,
        DocumentNo: querydata.DocumentNo,
        FollowupDateTime: querydata.FollowupDateTime,
        FollowupEndDateTime: querydata.FollowupEndDateTime,
        FollowupDetails: querydata.FollowupDetails,
        Visitto: querydata.Visitto,
        VisitorPerson: querydata.VisitorPerson,
        NextVisitDateTime: querydata.NextVisitDateTime,
        NextVisitPerson: querydata.NextVisitPerson,
        NextVisitorPerson: querydata.NextVisitorPerson,
        AttentionDetail: querydata.AttentionDetail,
        OrderGoesParty: querydata.OrderGoesParty,
        CloseReason: querydata.CloseReason,
        DetailDescription: querydata.DetailDescription,
        Rating: querydata.Rating,
        ModeofContact: querydata.ModeofContact,
        FollowupStatus: querydata.FollowupStatus,
      };
      console.log(params);
      const data = await (req as any).knex.raw(followupinquiryinsertquery, [
        params.Mode,
        params.SalesInquiryId,
        params.SalesInquiryDetailsId,
        params.CategoryId,
        params.UserId,
        params.DocumentNo,
        params.FollowupDateTime,
        params.FollowupEndDateTime,
        params.FollowupDetails,
        params.Visitto,
        params.VisitorPerson,
        params.NextVisitDateTime,
        params.NextVisitPerson,
        params.NextVisitorPerson,
        params.AttentionDetail,
        params.OrderGoesParty,
        params.CloseReason,
        params.DetailDescription,
        params.Rating,
        params.ModeofContact,
        params.FollowupStatus,
      ]);
      console.log(data);
      if (data[0].Output == 0) {
        throw new Error("Error while inserting inquiry followup, Please Try again");
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  })
userRouter.post(
  "/followup/quotation/insert",
  authenticateJWT,
  setDatabaseConnection,
  async (req: Request, res: Response) => {
    try {
      const querydata = req.body;
      const mode = "INSERT";
      const userId_categoryId = await (req as any).knex.raw(
        getUseridCategoryidfollowup,
        [208, querydata.category, querydata.user.uid]
      );
      const categoryID = userId_categoryId[0].CategoryId;
      const userID = userId_categoryId[0].Userid;
      const params = {
        SalesQuotationId: querydata.SalesQuotationId,
        SalesQuotationDetailsId: querydata.SalesQuotationDetailsId,
        CategoryId: categoryID,
        UserId: userID,
        DocumentNo: querydata.DocumentNo,
        FollowupDateTime: querydata.FollowupDateTime,
        FollowupEndDateTime: querydata.FollowupEndDateTime,
        FollowupDetails: querydata.FollowupDetails,
        Visitto: querydata.Visitto,
        VisitorPerson: querydata.VisitorPerson,
        NextVisitDateTime: querydata.NextVisitDateTime,
        NextVisitPerson: querydata.NextVisitPerson,
        NextVisitorPerson: querydata.NextVisitorPerson,
        AttentionDetail: querydata.AttentionDetail,
        OrderGoesParty: querydata.OrderGoesParty,
        CloseReason: querydata.CloseReason,
        DetailDescription: querydata.DetailDescription,
        Rating: querydata.Rating,
        ModeofContact: querydata.ModeofContact,
        FollowupStatus: querydata.FollowupStatus,
      };
      const data = await (req as any).knex.raw(followupquotationinsertquery, [
        mode,
        params.SalesQuotationId,
        params.SalesQuotationDetailsId,
        params.CategoryId,
        params.UserId,
        params.DocumentNo,
        params.FollowupDateTime,
        params.FollowupEndDateTime,
        params.FollowupDetails,
        params.Visitto,
        params.VisitorPerson,
        params.NextVisitDateTime,
        params.NextVisitPerson,
        params.NextVisitorPerson,
        params.AttentionDetail,
        params.OrderGoesParty,
        params.CloseReason,
        params.DetailDescription,
        params.Rating,
        params.ModeofContact,
        params.FollowupStatus,
      ]);
      console.log(data);
      if (data[0].Output == 0) {
        throw new Error("Error while inserting quotation followup, Please Try again");
      }
      res.status(200).json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  })

export default userRouter;
