CREATE OR REPLACE VIEW "public"."total_claimed_and_unclaimed" AS 
 SELECT 
    eden_transaction.category,
    sum(eden_transaction.amount) AS amount,
    sum(eden_transaction.usd_total) AS usd_total
  FROM eden_transaction
  WHERE ((eden_transaction.type)::text = 'income'::text)
  GROUP BY eden_transaction.category;
