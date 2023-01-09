CREATE OR REPLACE VIEW "public"."incomes_by_delegate" AS 
 SELECT historic_incomes.recipient,
    sum(historic_incomes.eos_claimed) AS eos_claimed,
    sum(historic_incomes.eos_unclaimed) AS eos_unclaimed,
    sum(historic_incomes.usd_claimed) AS usd_claimed,
    sum(historic_incomes.usd_unclaimed) AS usd_unclaimed
   FROM historic_incomes
  GROUP BY historic_incomes.recipient;
