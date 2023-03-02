CREATE OR REPLACE VIEW "public"."expenses_by_category_election_and_delegate" AS 

 SELECT total_expense_by_delegate_and_election.id_election,
    total_expense_by_delegate_and_election.category,
    total_expense_by_delegate_and_election.election,
    sum(total_expense_by_delegate_and_election.eos_amount) AS total_eos_amount,
    sum(total_expense_by_delegate_and_election.usd_amount) AS total_usd_amount
   FROM total_expense_by_delegate_and_election
  GROUP BY 
  total_expense_by_delegate_and_election.category, 
  total_expense_by_delegate_and_election.election,
  total_expense_by_delegate_and_election.id_election;
