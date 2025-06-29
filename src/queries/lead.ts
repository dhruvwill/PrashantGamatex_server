export const leadinsertquery = `
        DECLARE @Output INT;
        DECLARE @ErrorMessage NVARCHAR(4000);
        EXEC [dbo].[CRM_RefrenceTransactionDetailsInsertUpdateSP_2361]
          @Mode = ?, 
          @CompanyName = ?,
          @FormId = ?,
          @DocumentDate = ?,
          @CategoryId = ?,
          @ScreenName = ?,
          @UserId = ?,
          @RecordId = ?,
          @CurrencyId = ?,
          @ImageAttachment = ?,
          @UDF_CompanyName_2361 = ?, 
          @UDF_ContactPerson_2361 = ?, 
          @UDF_Designation_2361 = ?, 
          @UDF_MobileNo_2361 = ?, 
          @UDF_EmailId_2361 = ?, 
          @UDF_Product_2361 = ?, 
          @UDF_LeadSource_2361 = ?, 
          @UDF_CompetitionWith_2361 = ?, 
          @UDF_TimeFrame_2361 = ?, 
          @UDF_LeadRemindDate_2361 = ?, 
          @UDF_CustomerApplication_2361 = ?, 
          @UDF_CustomerExistingMachine_2361 = ?, 
          @UDF_LeadNotes_2361 = ?,
          @UDF_CustomerAdd_2361=?,
          @Output = @Output OUTPUT,
          @ErrorMessage = @ErrorMessage OUTPUT;
        SELECT @Output AS Output, @ErrorMessage AS ErrorMessage;
      `;

export const leadupdatequery = `
        DECLARE @Output INT;
        EXEC [dbo].[CRM_RefrenceTransactionDetailsInsertUpdateSP_2361]
          @Mode = ?, 
          @CompanyName = ?,
          @FormId = ?,
          @CategoryId = ?,
          @ScreenName = ?,
          @UserId = ?,
          @RecordId = ?,
          @CurrencyId = ?,
          @UDF_CompanyName_2361 = ?, 
          @UDF_ContactPerson_2361 = ?, 
          @UDF_Designation_2361 = ?, 
          @UDF_MobileNo_2361 = ?, 
          @UDF_EmailId_2361 = ?, 
          @UDF_Product_2361 = ?, 
          @UDF_LeadSource_2361 = ?, 
          @UDF_CompetitionWith_2361 = ?, 
          @UDF_TimeFrame_2361 = ?, 
          @UDF_LeadRemindDate_2361 = ?, 
          @UDF_CustomerApplication_2361 = ?, 
          @UDF_CustomerExistingMachine_2361 = ?, 
          @UDF_LeadNotes_2361 = ?,
          @UDF_CustomerAdd_2361=?,
          @Output = @Output OUTPUT;
        SELECT @Output AS Output;
      `;

export const getuserIdCategoryIdquery = `
        
        EXEC [dbo].[CRM_ReferenceTransactionGetUserIdCategoryId_2361]
          @ApplicableFormId = ?, 
          @UserCode = ?,
          @Currency = ?
      `;

export const getleads = `
        EXEC [dbo].[CRM_ReferenceTransactionGetDetails_2361]
        @UserCode = ?
      `;

export const leadFollowupInsertQuery = `
  DECLARE @Output INT;
  EXEC [dbo].[CRM_ReferenceTransaction_2361FollowupInsertSP]
    @ReferenceTransaction_2361Id = ?,
    @NextVisitDateTime = ?,
    @FollowupStatus = ?,
    @FollowupDateTime = ?,
    @FollowupDetails = ?,
    @CloseReason = ?,
    @ModeofContact = ?,
    @DetailDescription = ?,
    @VisitTo = ?,
    @VisitorPerson = ?,
    @Output = @Output OUTPUT;
  SELECT @Output AS Output;
`;

export const CRM_GetAllLeadReminders = `
  EXEC [dbo].[CRM_GetAllLeadReminders]
`