export const expenseinsertquery = `
    Declare @Output int;
    EXEC [CRM_ExpenseFormInsertDetails]
        @Usercode=?,
        @ExpDate=?,
        @CustomerCompanyName=?,
        @ExpType=?,
        @ExpDesc=?,
        @ExpAmount=?,
        @ExpImage=?,
        @Output=@Output OUTPUT;
    SELECT @Output as Output
`
export const expensegetdetailsquery = `
    EXEC [CRM_ExpenseGetDetails]
        @Usercode=?
    `