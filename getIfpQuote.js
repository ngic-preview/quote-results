const fetch = require('node-fetch')
const fs = require('fs')

const requestBody = {
  IfpRateFactors: {
    EffectiveDate: '2021-01-01',
    ZipCode: '97006',
    CountyName: 'Washington',
    State: 'OR',
    TermLength: 3,
    Members: [
      {
        MemberId: '1',
        LivesInHouseHold: 'true',
        MemberType: 'Subscriber',
        RelationshipType: 'Self',
        DateOfBirth: '1990-01-01',
        Gender: 'Male',
        IsSmoker: 'false',
      },
    ],
  },
  Preferences: {
    InsuranceTypes: ['ShortTerm'],
    PlanVisibility: 'OnWebsite',
    PlanEligibility: 'FullEligibilityOnly',
    BenchmarkPlan: 'Designate',
    FeaturedPlans: 'NoDesignation',
    QuoteFormat: 'PlanMembersDetail',
    AddOns: [
      'CarrierData',
      'PlanData',
      'BenefitsData',
      'BenefitsFlag',
      'BenefitsFull',
      'BenefitsTiny',
      'CarrierDetails',
      'DroppedRates',
      'PlanDetails',
    ],
  },
  RemoteAccessKey: 'FCDE9309-1174-4D6C-9ADF-77D056B35ECE',
  WebsiteAccessKey: '73E87F47-6D56-4992-871D-9B4CE4A69DEC',
  BrokerId: '23502885',
}

const api = 'https://www.quotit.net/quotit/apps/Common/ActWS/ACA/v2'
const method = 'GetIfpQuote'
fetch(`${api}/${method}`, {
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7,ja-JP;q=0.6,ja;q=0.5',
    'cache-control': 'no-cache',
    'content-type': 'application/json;charset=UTF-8',
    pragma: 'no-cache',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
  },
  referrer: `${api}?Method=${method}`,
  referrerPolicy: 'allow-cross-origin',
  body: JSON.stringify(requestBody),
  method: 'POST',
  mode: 'cors',
  credentials: 'include',
})
  .then(r => r.json())
  .then(r =>
    fs.writeFile('./data/preShortTerm.json', JSON.stringify(r), 'utf8', err => {
      if (err) throw err
      console.log('File created')
    })
  )
