export const getfollowupinquiry = `
        EXEC [dbo].[CRM_SalesFollowupInquiryGetDetails]
        @UserCode = ?
      `

export const getfollowupquotation = `
        EXEC [dbo].[CRM_SalesFollowupQuotationGetDetails]
        @UserCode = ?
      `

export const getUseridCategoryidfollowup = `
        EXEC [dbo].[CRM_SalesFollowupGetUseridCategoryid]
	@ApplicableFormId = ?
	@CategoryName = ?,
        @Usercode = ?,
`

export const followupinquiryinsertquery = `
        DECLARE Output INT;
        EXEC [dbo].[CRM_SalesFollowupInquiryDetailsInsert]
            @Mode = ?,
            @SalesInquiryId = ?,
            @SalesInquiryDetailsId = ?,
            @CategoryId = ?,
	    @UserMasterId = ?,
	    @DocumentNo = ?,
            @FollowupDateTime = ?,
            @FollowupEndDateTime = ?,
            @FollowupDetails = ?,
            @Visitto = ?, 
            @VisitorPerson = ?,
            @NextVisitDateTime = ?,
            @NextVisitPerson = ?,
            @NextVisitorPerson = ?,
            @AttentionDetail = ?,
            @OrderGoesParty = ?,
            @CloseReason = ?,
            @DetailDescription = ?,
            @Rating = ?,
            @ModeofContact = ?,
            @FollowupStatus = ?,
            @Output = @Output OUTPUT
            
        SELECT @Output AS Output;
`
export const followupquotationinsertquery = `
        DECLARE Output INT;
        EXEC [dbo].[CRM_SalesFollowupQuotationDetailsInsert]
            @Mode = ?,
            @SalesQuotationId = ?,
            @SalesQuotationDetailsId = ?,
            @CategoryId = ?,
	    @UserMasterId = ?,
	    @DocumentNo = ?,
            @FollowupDateTime = ?,
            @FollowupEndDateTime = ?,
            @FollowupDetails = ?,
            @Visitto = ?, 
            @VisitorPerson = ?,
            @NextVisitDateTime = ?,
            @NextVisitPerson = ?,
            @NextVisitorPerson = ?,
            @AttentionDetail = ?,
            @OrderGoesParty = ?,
            @CloseReason = ?,
            @DetailDescription = ?,
            @Rating = ?,
            @ModeofContact = ?,
            @FollowupStatus = ?,
            @Output = @Output OUTPUT
            
        SELECT @Output AS Output;
`