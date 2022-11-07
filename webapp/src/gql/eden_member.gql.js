export const GET_MEMBERS_DATA = `
  query getMembers($value: String, $orderBy: [member_order_by!], $limit: Int) {
    memberPag: member_aggregate(
      order_by: $orderBy
      where: { account: { _eq: $value } }
    ) {
      aggregate {
        count
      }
    }
    members: member(
      limit: $limit
      order_by: $orderBy
      where: { account: { _eq: $value } }
    ) {
      account
      election_participation_status
      election_rank
      encryption_key
      name
      nft_template_id
      profile
      representative
      status
      eosioVoters: eosio_voters {
        producers
        proxy
      }
      vote {
        account
        producers
        weight
      }
    }
  }
`
