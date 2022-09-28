create or replace view "percent_by_all_elections" as
select 
percent_by_election.election, 
(coalesce((select sum(amount) from
total_claimed_and_unclaimed_by_election where category='claimed' and election=percent_by_election.election), 0))/total.amount as eos_claimed,
(coalesce((select sum(amount) from
total_claimed_and_unclaimed_by_election where category='unclaimed' and election=percent_by_election.election), 0))/total.amount as eos_unclaimed,
(coalesce((select sum(usd_total) from
total_claimed_and_unclaimed_by_election where category='claimed' and election=percent_by_election.election),0))/total.usd_total as usd_claimed,
(coalesce((select sum(usd_total) from
total_claimed_and_unclaimed_by_election where category='unclaimed' and election=percent_by_election.election), 0))/total.usd_total as usd_unclaimed
from total_claimed_and_unclaimed_by_election as percent_by_election
join total_income_by_election as total on total.election = percent_by_election.election
group by percent_by_election.election, total.usd_total, total.amount
order by percent_by_election.election;
