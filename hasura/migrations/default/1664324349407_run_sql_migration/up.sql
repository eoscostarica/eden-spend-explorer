create or replace view "percent_by_delegades" as
select 
incomes_by_delegates.recipient,
incomes_by_delegates.election, 
(coalesce((select sum(eos_claimed) from
historic_incomes where election=incomes_by_delegates.election and recipient=incomes_by_delegates.recipient), 0))/total.amount as eos_claimed,
(coalesce((select sum(eos_unclaimed) from
historic_incomes where election=incomes_by_delegates.election and recipient=incomes_by_delegates.recipient), 0))/total.amount as eos_unclaimed,
(coalesce((select sum(usd_claimed) from
historic_incomes where election=incomes_by_delegates.election and recipient=incomes_by_delegates.recipient),0))/total.usd_total as usd_claimed,
(coalesce((select sum(usd_unclaimed) from
historic_incomes where election=incomes_by_delegates.election and recipient=incomes_by_delegates.recipient), 0))/total.usd_total as usd_unclaimed
from historic_incomes as incomes_by_delegates
join total_income_by_election as total on total.election = incomes_by_delegates.election
group by incomes_by_delegates.election, total.usd_total, total.amount, incomes_by_delegates.recipient
order by incomes_by_delegates.election;
