<template>
  <v-app>
    <v-main class="svg-bg">
      <QuotesPagination
        :quotes="this.quotes"
        :config="this.configOptions"
        :filters="this.filters"
      />
    </v-main>
  </v-app>
</template>

<script>
import QuotesPagination from '@/components/QuotesPagination.vue'
import quoteJson from '../data.json'

export default {
  name: 'App',

  components: {
    QuotesPagination,
  },

  data: () => ({
    quoteJson,
    quotes: [],
    carriers: [],
    effectiveDate: '',
    graphData: {},
    configOptions: {
      theme: {},
      selectedBenefits: [],
    },
    filters: {
      carriers: [],
      networks: [],
      planRatings: [],
    },
  }),

  beforeMount() {
    //const quoteResults = decodeURIComponent(this.$parent.$el.getAttribute('data-init-vue'))
    if (quoteJson.IfpQuoteResponse) {
      this.effectiveDate = quoteJson.IfpQuoteRequest.EffectiveDate

      this.configOptionsHandler(quoteJson.ConfigurableOptions)
      this.quotesDataHandler(quoteJson.IfpQuoteResponse.IfpQuote.Carriers)
    }
  },

  methods: {
    graphDataHandler(benefit) {
      let key = ''
      if (typeof benefit === 'number') {
        key = 'Rate'
        const rate = this.configOptions.standardBenefits.find((el) => el.Code === key)
        rate.values.push(benefit)
        rate.maxPrice = Math.max(rate.maxPrice, benefit)
        rate.minPrice = Math.min(rate.minPrice, benefit)
      } else if (benefit.code === 'ACA1MedicalDrugDeductible') {
        key = benefit.code
        this.configOptions.standardBenefits
          .find((el) => el.Code === key)
          .values.push(benefit.intValue)
      } else if (this.configOptions.selectedBenefits.find((el) => el.Code === benefit.code)) {
        key = benefit.code
        this.configOptions.selectedBenefits
          .find((el) => el.Code === key)
          .values.push(benefit.intValue)
      }
    },
    setGraphComparisonData() {
      this.configOptions.selectedBenefits.forEach((benefit) => {
        let sum = benefit.values.reduce((previous, current) => (current += previous))
        benefit.averagePrice = Math.floor(sum / benefit.values.length)

        benefit.values.sort((a, b) => a - b)
        let low = Math.floor((benefit.values.length - 1) / 2)
        let high = Math.ceil((benefit.values.length - 1) / 2)
        benefit.medianPrice = (benefit.values[low] + benefit.values[high]) / 2
      })

      this.configOptions.standardBenefits.forEach((benefit) => {
        let sum = benefit.values.reduce((previous, current) => (current += previous))
        benefit.averagePrice = Math.floor(sum / benefit.values.length)

        benefit.values.sort((a, b) => a - b)
        let low = Math.floor((benefit.values.length - 1) / 2)
        let high = Math.ceil((benefit.values.length - 1) / 2)
        benefit.medianPrice = Math.floor((benefit.values[low] + benefit.values[high]) / 2)
      })
    },
    quotesDataHandler(carriersData) {
      carriersData.forEach((carrierData) => {
        let carrier = {}
        carrier.name = carrierData.CarrierDetails.Name
        carrier.id = carrierData.CarrierDetails.CarrierId
        carrier.logoSrcSm = carrierData.CarrierDetails.LogoFileSmall
        carrier.logoSrcMd = carrierData.CarrierDetails.LogoFileMedium
        carrier.logoSrcMdTransparent = carrierData.CarrierDetails.LogoFileMediumTransparent
        carrier.logoSrcLg = carrierData.CarrierDetails.LogoFileLarge

        this.carriers.push(carrier)
        this.addToFilters(carrier.name, 'carriers')

        carrierData.PlanRates.forEach((planRate) => {
          let quote = {}
          quote.carrier = carrier

          let plan = {}
          plan.id = planRate.PlanId
          plan.name = planRate.PlanDetails.Name
          plan.rate = planRate.Rate
          plan.rating = planRate.PlanDetails.BenefitLevel
          plan.type = planRate.PlanDetails.PlanType
          plan.providerLink = planRate.PlanDetails.ProviderLink

          this.graphDataHandler(plan.rate)

          this.addToFilters(plan.type, 'networks')
          this.addToFilters(plan.rating, 'planRatings')

          plan.benefits = []

          planRate.PlanDetails.Benefits.forEach((benefitData) => {
            let benefit = {}
            benefit.category = benefitData.Category
            benefit.name = benefitData.BenefitData.find(
              (e) => e.Name === 'TinyName' || e.name === 'Shortname' || e.Name === 'Name'
            ).Value
            benefit.value = benefitData.TinyValue
            benefit.intValue =
              benefit.value.charAt(0) === '$'
                ? parseInt(benefit.value.replaceAll(/\D/gi, ''))
                : null
            benefit.code = benefitData.Enum
            benefit.details = benefitData.FullValue

            // set cheapest/most expensive benefits and get graph data
            let checkSelectedBenefit = this.configOptions.selectedBenefits.find(
              (el) => el.Code === benefit.code
            )
            let checkDeductible = this.configOptions.standardBenefits.find(
              (el) => el.Code === benefit.code
            )
            if (typeof checkSelectedBenefit !== 'undefined') {
              checkSelectedBenefit.maxPrice = Math.max(
                checkSelectedBenefit.maxPrice,
                benefit.intValue
              )
              checkSelectedBenefit.minPrice = Math.min(
                checkSelectedBenefit.minPrice,
                benefit.intValue
              )

              this.graphDataHandler(benefit)
            }
            if (typeof checkDeductible !== 'undefined') {
              checkDeductible.maxPrice = Math.max(checkDeductible.maxPrice, benefit.intValue)
              checkDeductible.minPrice = Math.min(checkDeductible.minPrice, benefit.intValue)

              this.graphDataHandler(benefit)
            }
            plan.benefits.push(benefit)
          })
          quote.plan = plan
          this.quotes.push(quote)
        })
      })
      this.setGraphComparisonData()
      console.log(this.quotes)
      console.log(this.configOptions)
    },
    configOptionsHandler(configData) {
      this.configOptions.theme = configData.Theme
      this.configOptions.standardBenefits = configData.StandardBenefits
      this.configOptions.selectedBenefits = configData.OptionalBenefits
      this.configOptions.selectedBenefits.forEach((benefit) => {
        benefit.minPrice = Number.MAX_SAFE_INTEGER
        benefit.maxPrice = Number.MIN_SAFE_INTEGER
        benefit.values = [] //All values of this benefit from all plans
      })
      this.configOptions.standardBenefits.forEach((benefit) => {
        benefit.minPrice = Number.MAX_SAFE_INTEGER
        benefit.maxPrice = Number.MIN_SAFE_INTEGER
        benefit.values = [] //All values of this benefit from all plans
      })
    },
    addToFilters(filter, filterCategory) {
      let filterItem = {}

      // check if param filter is already in main filters object
      if (this.filters[filterCategory].some((el) => el.value === filter)) return
      filterItem.value = filter
      filterItem.text = filter
      console.log(filterCategory)
      this.filters[filterCategory].push(filterItem)
    },
  },
}
</script>

<style lang="scss">
.svg-bg {
  background-color: #2a9d8f;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 2 1'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%232a9d8f'/%3E%3Cstop offset='1' stop-color='%234fd'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23264653' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23264653' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='2' y2='2'%3E%3Cstop offset='0' stop-color='%23264653' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23264653' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='2' height='1'/%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='url(%23b)' points='0 1 0 0 2 0'/%3E%3Cpolygon fill='url(%23c)' points='2 1 2 0 0 0'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}
</style>
