<template>
  <v-app>
    <v-navigation-drawer
      stateless
      app
      :value="showFilter"
      clipped
      elevation="0"
      color="grey lighten-5"
      width="256"
    >
      <!-- <template v-slot:prepend>
        <v-toolbar
          color="white"
          elevation="0"
          style="border-bottom: solid 1px rgba(0, 0, 0, 0.2) !important"
        >
        </v-toolbar>
      </template> -->

      <v-row justify="center" class="px-4 mt-4">
        <v-col cols="12" v-for="key in Object.keys(filters)" :key="key">
          <h6 class="pt-0 mt-0 mb-3 text-subtitle-1" style="font-weight: 600">
            {{ filterHeading(key) }}
          </h6>
          <v-checkbox
            dense
            multiple
            hide-details
            class="mt-0"
            color="indigo"
            v-for="(filter, i) in filters[key]"
            :key="i"
            v-model="filterBy[key]"
            :value="filter"
          >
            <template v-slot:label>
              <span class="text-subtitle-2 grey--text text--darken-2" style="">
                {{ filter }}
              </span>
            </template>
          </v-checkbox>
          <div class="pt-8" style="border-bottom: 1px solid rgba(0, 0, 0, 0.2)"></div>
        </v-col>

        <v-col cols="12">
          <h6 class="mb-5 text-subtitle-1" style="font-weight: 600">Deductible max</h6>
          <v-slider
            :min="deductible.minPrice"
            :max="deductible.maxPrice"
            hide-details
            step="50"
            thumb-label="always"
            thumb-size="28"
            class="align-center pr-2"
            color="indigo"
            track-color="deep-orange accent-4"
            v-model="filterBy.deductibleMax"
          >
            <template v-slot:thumb-label="{ value }">
              <span class="grey--text text-dollar-sm text--darken-2"> ${{ value }} </span>
            </template>
            <!--  <template class="my-0 py-0" v-slot:append>
              <v-text-field
                v-model="filterBy.deductibleMax"
                prefix="$"
                class="my-0 py-0"
                hide-details
                type="number"
                style="width: 68px"
              >
              </v-text-field>
            </template> -->
          </v-slider>
          <div class="mt-4" style="border-bottom: 1px solid rgba(0, 0, 0, 0.2)"></div>
        </v-col>

        <v-col cols="12">
          <h6 class="mb-5 text-subtitle-1" style="font-weight: 600">Premium max</h6>
          <v-slider
            :min="premium.minPrice"
            :max="premium.maxPrice"
            hide-details
            thumb-label="always"
            thumb-size="28"
            class="align-center pr-3"
            color="indigo"
            track-color="deep-orange accent-4"
            v-model="filterBy.premiumMax"
          >
            <template v-slot:thumb-label="{ value }">
              <span class="grey--text text--darken-2 text-dollar-sm"> ${{ value }} </span>
            </template>
            <!-- <template v-slot:append>
              <v-text-field
                v-model="filterBy.premiumMax"
                class="my-0 py-0"
                prefix="$"
                hide-details
                type="number"
                style="width: 68px"
              >
              </v-text-field>
            </template> -->
          </v-slider>
        </v-col>
      </v-row>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="white"
      light
      elevation="0"
      style="border-bottom: solid 1px rgba(0, 0, 0, 0.2) !important"
    >
      <v-btn
        class="text-none"
        text
        :color="showFilter ? 'red accent-2' : ''"
        @click.stop="$store.dispatch('toggleFilter')"
        ><v-icon left>{{ showFilter ? 'mdi-filter-off' : 'mdi-filter' }}</v-icon
        >{{ showFilter ? 'Hide ' : 'Show ' }}filters
      </v-btn>
      <v-badge
        color="red "
        class="mr-6"
        overlap
        dot
        :value="compareLength > 1"
        :content="compareLength.toString()"
      >
        <v-btn text @click="$store.dispatch('toggleCompare')" class="text-none pr-2"
          ><v-icon left>mdi-compare-horizontal</v-icon>Compare plans
        </v-btn>
      </v-badge>

      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-spacer></v-spacer>
        <v-text-field
          solo
          background-color="grey lighten-3"
          flat
          clearable
          label="Search"
          class=""
          prepend-inner-icon="mdi-magnify"
          style="max-width: 350px; width: 100%"
          hide-details
          v-model="search"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-select
          @change="$store.dispatch('sortBy', $event)"
          flat
          style="max-width: 250px; width: 100%"
          solo
          background-color="grey lighten-3"
          class="pr-11"
          hide-details
          item-text="label"
          item-value="value"
          :items="sortItems"
          label="Sort by"
        >
          <template v-slot:append-outer>
            <v-btn-toggle
              class=""
              active-class="neumorphed-btn toggle-btn"
              style="position: absolute; top: 0; border: none !important"
              @change="$store.dispatch('toggleSortDesc')"
            >
              <v-btn
                color="grey lighten-3"
                style="top: 0; min-width: 50px; max-width: 50px; height: 48px"
              >
                <v-icon size="24" class="px-0">{{
                  sortDesc ? 'mdi-sort-ascending' : 'mdi-sort-descending'
                }}</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-select>
      </template>
    </v-app-bar>

    <v-main class="grey lighten-5">
      <v-container fluid>
        <QuotesPagination
          :search="search"
          :quotes="this.quotes"
          :config="this.config"
          :filters="this.filterBy"
        />
        <CompareModal :config="this.config" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

import QuotesPagination from '@/components/QuotesPagination.vue'
import CompareModal from '@/components/CompareModal.vue'
import quoteJson from '../data/IndividualHealth.json'
//import quoteJson from '../data/ShortTerm.json'

export default {
  name: 'App',
  components: {
    QuotesPagination,
    CompareModal,
  },
  data: () => ({
    quoteJson,
    search: '',
    quotes: [],
    carriers: [],
    effectiveDate: '',
    graphData: {},
    config: {
      theme: {},
      insuranceType: '',
      selectedBenefits: [],
      standardBenefits: [
        {
          Code: 'Rate',
          Label: 'Premium',
        },
        {
          Code: 'ACA1MedicalDrugDeductible',
          Label: 'Deductible',
        },
      ],
    },
    filters: {
      carriers: [],
      networks: [],
      planRatings: [],
    },
    filterBy: {
      carriers: [],
      networks: [],
      planRatings: [],
      deductibleMax: 0,
      premiumMax: 0,
    },
  }),
  beforeMount() {
    //const quoteJson = decodeURIComponent(this.$parent.$el.getAttribute('data-init-vue'))
    if (quoteJson.IfpQuoteResponse) {
      this.effectiveDate = quoteJson.IfpQuoteRequest.EffectiveDate

      this.configHandler(quoteJson.ConfigurableOptions)
      this.quotesDataHandler(quoteJson.IfpQuoteResponse.IfpQuote.Carriers)
    }
  },
  updated() {
    document
      .querySelectorAll('.v-slider__thumb-label')
      .forEach((el) => el.classList.remove('indigo'))
  },
  mounted() {
    document
      .querySelectorAll('.v-slider__thumb-label')
      .forEach((el) => el.classList.remove('indigo'))

    this.filterBy.deductibleMax = this.deductible.maxPrice
    this.filterBy.premiumMax = this.premium.maxPrice
  },
  computed: {
    sortItems() {
      let items = [
        { label: 'Rate', value: 'plan.rate' },
        { label: 'Deductible', value: 'plan.deductible' },
        { label: 'Plan Name', value: 'plan.name' },
        { label: 'Carrier', value: 'carrier.name' },
        { label: 'Level', value: 'plan.rating' },
        { label: 'Network', value: 'plan.type' },
      ]
      return items
    },
    deductible() {
      return this.config.standardBenefits.find(
        (el) => el.Code === this.config.standardBenefits[1].Code
      )
    },
    premium() {
      return this.config.standardBenefits.find((el) => el.Code === 'Rate')
    },
    ...mapGetters(['compare', 'compareLength', 'sortDesc', 'sortBy', 'showFilter']),
  },
  methods: {
    filterHeading(key) {
      switch (key) {
        default:
          return key.charAt(0).toUpperCase() + key.substr(1)
        case 'planRatings':
          if (this.config.insuranceType === 'ShortTerm') {
            break
          }
          return 'Levels'
      }
    },
    graphDataHandler(benefit) {
      let key = ''
      if (typeof benefit === 'number') {
        key = 'Rate'
        const rate = this.config.standardBenefits.find((el) => el.Code === key)
        rate.values.push(benefit)
        rate.maxPrice = Math.max(rate.maxPrice, benefit)
        rate.minPrice = Math.min(rate.minPrice, benefit)
      } else if (benefit.code === this.config.standardBenefits[1].Code) {
        key = benefit.code
        this.config.standardBenefits.find((el) => el.Code === key).values.push(benefit.intValue)
      } else if (this.config.selectedBenefits.find((el) => el.Code === benefit.code)) {
        key = benefit.code
        this.config.selectedBenefits.find((el) => el.Code === key).values.push(benefit.intValue)
      }
    },
    setGraphComparisonData() {
      this.config.selectedBenefits.forEach((benefit) => {
        if (!benefit.values[0]) return
        let sum = benefit.values.reduce((previous, current) => (current += previous))
        benefit.averagePrice = Math.floor(sum / benefit.values.length)

        benefit.values.sort((a, b) => a - b)
        let low = Math.floor((benefit.values.length - 1) / 2)
        let high = Math.ceil((benefit.values.length - 1) / 2)
        benefit.medianPrice = (benefit.values[low] + benefit.values[high]) / 2
      })

      this.config.standardBenefits.forEach((benefit) => {
        let sum = benefit.values.reduce((previous, current) => (current += previous))
        benefit.averagePrice = Math.floor(sum / benefit.values.length)

        benefit.values.sort((a, b) => a - b)
        let low = Math.floor((benefit.values.length - 1) / 2)
        let high = Math.ceil((benefit.values.length - 1) / 2)
        benefit.medianPrice = Math.floor((benefit.values[low] + benefit.values[high]) / 2)
      })
    },
    quotesDataHandler(carriersData) {
      this.config.insuranceType = carriersData[0].CarrierDetails.InsuranceType
      if (this.config.insuranceType === 'ShortTerm') {
        this.config.standardBenefits.find((el) => el.Label === 'Deductible').Code =
          'AnnualDeductible'
        delete this.filters.planRatings
        delete this.filterBy.planRatings
      }

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
          if (plan.rating !== undefined) {
            this.addToFilters(plan.rating, 'planRatings')
          }

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

            if (benefit.code === this.config.standardBenefits[1].Code)
              plan.deductible = benefit.intValue
            // set cheapest/most expensive benefits and get graph data
            let checkSelectedBenefit = this.config.selectedBenefits.find(
              (el) => el.Code === benefit.code
            )
            let checkDeductible = this.config.standardBenefits.find(
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
      console.log(this.quotes)
      console.log(this.config)
      this.setGraphComparisonData()
    },
    configHandler(configData) {
      this.config.theme = configData.Theme
      this.config.selectedBenefits = configData.OptionalBenefits
      this.config.selectedBenefits.forEach((benefit) => {
        benefit.minPrice = Number.MAX_SAFE_INTEGER
        benefit.maxPrice = Number.MIN_SAFE_INTEGER
        benefit.values = [] //All values of this benefit from all plans
      })
      this.config.standardBenefits.forEach((benefit) => {
        benefit.minPrice = Number.MAX_SAFE_INTEGER
        benefit.maxPrice = Number.MIN_SAFE_INTEGER
        benefit.values = [] //All values of this benefit from all plans
      })
    },
    addToFilters(filter, filterCategory) {
      // check if param filter is already in main filters object
      if (this.filters[filterCategory].some((el) => el === filter)) return

      this.filters[filterCategory].push(filter)
    },
  },
}
</script>

<style lang="scss">
.v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
  opacity: 0.08;
}
.theme--light.v-btn--active:hover::before,
.theme--light.v-btn--active::before {
  opacity: 0.04;
}
/* .v-navigation-drawer__border {
  border-color: rgba(0, 0, 0, 0.2);
  height: calc(100% - 64px) !important;
  top: 64px !important;
} */
.v-slider__thumb-label {
  background-color: transparent !important;
  margin-bottom: -4px;
}

.svg-bg {
  background-color: #2a9d8f;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 2 1'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%232a9d8f'/%3E%3Cstop offset='1' stop-color='%234fd'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23264653' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23264653' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='2' y2='2'%3E%3Cstop offset='0' stop-color='%23264653' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23264653' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='2' height='1'/%3E%3Cg fill-opacity='0.5'%3E%3Cpolygon fill='url(%23b)' points='0 1 0 0 2 0'/%3E%3Cpolygon fill='url(%23c)' points='2 1 2 0 0 0'/%3E%3C/g%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}
</style>
