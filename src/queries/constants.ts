export const constantsquery = `
        EXEC [dbo].[CRM_ConstantsGetValues]
          @LeadSource = ?, 
	        @TimeFrame = ?,
	        @Currency = ?,
	        @Category = ?,
                @Product = ?,
                @Application = ?,
                @Expense = ?,
                @Form = ?,
                @Usercode=?
`;

export const getdocumentnofollowupquery = `
        EXEC [dbo].[CRM_FetchDocumentNo_SalesFollowup]
            @CategoryName =?,
	        @DocumentNo =?
        `;
export const getdocumentnoleadquery = `
        EXEC [dbo].[CRM_FetchDocumentNo_ReferenceTransaction_2361]
            @CategoryName = ?,
	    @DocumentNo = ?
        `;

export const getcategoryfollowup = `
        EXEC [dbo].[CRM_SalesFollowupFetchCategoryValues]
                @UserCode = ?
`;

export const getAssociatedUsersLead = `
        EXEC [dbo].[CRM_GetAssociatedUsersDropdownLeads]
	@UserCode=?
`

export const getAssociatedUsersFollowup = `
        EXEC [dbo].[CRM_GetAssociatedUsersDropdownFollowup]
	@UserCode=?
`