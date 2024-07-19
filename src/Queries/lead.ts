export const leadinsertquery = `
        DECLARE @Output INT;
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
          @Output = @Output OUTPUT;
        SELECT @Output AS Output;
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
