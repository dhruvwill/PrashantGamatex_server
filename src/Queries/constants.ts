export const constantsquery = `
        EXEC [dbo].[CRM_ConstantsGetValues]
          @LeadSource = ?, 
	        @TimeFrame = ?,
	        @Currency = ?,
	        @Category = ?
`;

export const getdocumentnofollowupquery = `
        EXEC [dbo].[CRM_FetchDocumentNo_SalesFollowup]
            @CategoryId =?,
	        @DocumentNo =?
        `   
export const getdocumentnoleadquery = `
        EXEC [dbo].[CRM_FetchDocumentNo_SalesFollowup]
            @CategoryId =?,
	        @DocumentNo =?
        `   