<template>
  <!-- <v-hover v-slot="{ hover }"> -->
  <v-card elevation="3" :class="`box mx-auto ${'mt-6 pt-2'}`">
    <div class="ribbon ribbon-top-left">
      <span :class="`${planRatingClass}`">{{
        planRatingClass === 'primary' ? quote.plan.type : quote.plan.rating + ' ' + quote.plan.type
      }}</span>
    </div>
    <v-list-item class="grow">
      <v-list-item-content>
        <v-list-item-title class="text-h6 font-weight-medium">
          <span class="d-flex align-center">
            <v-img contain max-height="35" max-width="100" :src="quote.carrier.logoSrcLg" class="pr-4"></v-img>
            {{ planName }}
          </span>
        </v-list-item-title>
        <v-list-item-subtitle> </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-card-text class="py-0 grey--text text--darken-3">
      <v-row class="pt-2" justify="center" align="center">
        <v-col cols="6">
          <v-row justify="center" no-gutters align="start">
            <v-col cols="6" class="text-center">
              <h6 class="subtitle-2 ml-2 font-weight-regular grey--text text--darken-1">
                Premium
                <TooltipIcon message="How much this plan costs on a monthly basis." />
              </h6>

              <div class="text-dollar font-weight-bold">
                <sup class="dollar-sign">$</sup>
                {{ this.quote.plan.rate }}
                <span class="ml-n1 text-body-2"> /mo </span>
              </div>
            </v-col>
            <v-col cols="6" class="text-center">
              <h6 class="ml-2 subtitle-2 grey--text text--darken-1">
                Deductible
                <TooltipIcon
                  message="The amount you must spend on healthcare services in one year before your insurance benefits take effect.  Before it is met, you are required pay the full price or the designated pre-deductible price for health services."
                />
              </h6>
              <div class="text-dollar">
                <sup v-show="this.deductible !== 'N/A'" class="dollar-sign">$</sup>
                {{ this.deductible }}
                <span v-show="this.deductible !== 'N/A'" class="ml-n1 text-body-2"> /yr </span>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row no-gutters v-for="item in benefitsOptions" :key="item.name">
            <v-col col="6">
              <h6 class="subtitle-2 font-weight-regular grey--text text--darken-1">
                {{ item.Label }}
                <TooltipIcon
                  v-if="item.Code === 'ACA1EHBDrugOOPMax'"
                  message="The most you will have to pay in one year on healthcare expenses.  Once you have reached your maximum out-of-pocket, your insurance will pay 100% of the allowed amount of in-network, essential health benefits. Expenses that count towards your maximum out-of-pocket include deductibles, coinsurance, copayments, or other elligible expenses."
                />
              </h6>
            </v-col>
            <v-col col="6">
              <h5 class="text-dollar-sm">
                {{
                  quote.plan.benefits.some((el) => el.code === item.Code)
                    ? quote.plan.benefits.find((el) => el.code === item.Code).value
                    : 'N/A'
                }}
              </h5>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            class="text-none"
            small
            text
            @click="showGraph = !showGraph"
            :key="activeFab.icon"
            :color="activeFab.color"
          >
            {{ (showGraph ? 'Hide' : 'Show') + ' graph' }}
            <v-icon right>{{ activeFab.icon }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-expand-transition>
      <div v-if="showGraph" class="transition-fast-in-fast-out">
        <v-sheet color="accent">
          <v-row justify="center" dense align="center">
            <v-col cols="auto">
              <v-select
                append-icon=""
                :style="`width: ${graphSelectSize}; height: 38px`"
                :menu-props="{ bottom: true, offsetY: true }"
                dense
                v-model="graphSelected"
                :items="graphSelectOptions"
                return-object
                item-text="Label"
                item-value="Code"
              >
              </v-select>
            </v-col>
            <v-col cols="auto">
              <h6 class="subtitle-1 text-center pa-0">
                {{ ' cost across all plans' }}
              </h6>
            </v-col>
          </v-row>
          <v-sparkline
            :value="graphData"
            :key="this.graphSelected.Code"
            :gradient="this.$vuetify.theme.themes.light.gradient2"
            gradient-direction="top"
            stroke-linecap="round"
            line-width="2"
            :smooth="6"
            padding="18"
            auto-draw
          >
            <template v-slot:label="item">
              <tspan class="text-dollar-sm-graph">${{ item.value }}</tspan>
              <tspan
                v-if="item.index !== 1 && item.index !== 2"
                style="font-size: 5px !important"
                class="text-subtitle-2 font-weight-regular grey--text text--darken-1"
                text-anchor="middle"
                dx="-16"
                dy="-9"
                >{{ getGraphLabel(item.index) }}</tspan
              >
              <tspan
                v-if="item.index === 1"
                style="font-size: 5px !important"
                class="text-subtitle-2 font-weight-regular grey--text text--darken-1"
                text-anchor="middle"
                dx="-25"
                dy="-9"
                >{{ getGraphLabel(item.index) }}</tspan
              >
              <tspan
                v-if="item.index === 2"
                style="font-size: 5px !important"
                class="text-subtitle-2 font-weight-regular grey--text text--darken-1"
                text-anchor="middle"
                dx="-19"
                dy="-9"
                >{{ getGraphLabel(item.index) }}</tspan
              >
            </template>
          </v-sparkline>
        </v-sheet>
      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions class="mx-2">
      <v-btn class="text-none mx-1" small text color="indigo"
        ><v-icon size="14" left>mdi-format-list-bulleted</v-icon>Details</v-btn
      >
      <v-btn class="text-none mr-1" small text color="indigo"
        ><v-icon size="14" left>mdi-stethoscope</v-icon>Doctors and providers</v-btn
      >
      <v-btn
        class="text-none"
        small
        text
        :color="this.isCompared ? 'red' : 'indigo'"
        @click="handleCompare()"
        ><v-icon size="14" left>{{
          this.isCompared ? 'mdi-close' : 'mdi-compare-horizontal'
        }}</v-icon
        >{{ this.isCompared ? 'Remove from ' : 'Add to ' }}compare
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="mx-auto px-5 text-none" color="secondary">Choose plan</v-btn>
    </v-card-actions>
  </v-card>
  <!-- </v-hover> -->
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import TooltipIcon from '@/components/TooltipIcon.vue'

export default {
  props: {
    quote: {
      type: Object,
      required: true,
    },
    benefitsOptions: {
      type: Array,
      required: true,
    },
    standardBenefits: {
      type: Array,
      required: true,
    },
  },
  beforeMount() {
    this.getGraphSelectOptions()
    this.graphSelected = this.graphSelectOptions[0]
  },
  mounted() {},
  data() {
    let combinedBenefits = this.standardBenefits.concat(this.benefitsOptions)

    return {
      showGraph: false,
      graphLabels: [],
      isCompared: false,
      combinedBenefits,
      graphSelected: {},
      graphSelectOptions: [],
      selectedGraphData: [],
    }
  },

  components: {
    TooltipIcon,
  },
  methods: {
    handleCompare() {
      if (!this.compare.some((el) => el.plan.id === this.quote.plan.id)) {
        this.isCompared = true
        this.$store.dispatch('addToCompare', this.quote)
      } else {
        this.isCompared = false
        this.$store.dispatch('removeFromCompare', this.quote)
      }
    },
    getGraphSelectOptions() {
      this.combinedBenefits.forEach((benefit) => {
        this.graphSelectOptions.push({ ...benefit })
      })
    },
  },
  computed: {
    planRatingClass() {
      let str = 'primary'
      if (this.quote.plan.rating !== undefined) {
        str = String(this.quote.plan.rating).toLowerCase()
      }
      return str
    },
    graphSelectSize() {
      let size = `100px`
      const sizeEl = document.querySelector('.resize-font')
      sizeEl.textContent = this.graphSelected.Label
      size = `${Math.ceil(sizeEl.clientWidth * 1.1)}px`

      return size
    },
    getGraphLabel() {
      return function (index) {
        switch (index) {
          case 0:
            return 'Lowest'
          case 1:
            return 'Most common'
          case 2:
            return 'This plan'
          case 3:
            return 'Average'
          case 4:
            return 'Highest'
          default:
            return ''
        }
      }
    },
    graphData() {
      let selectedBenefitPrice = 0
      if (this.graphSelected.Code === 'Rate') {
        selectedBenefitPrice = this.quote.plan.rate
      } else {
        selectedBenefitPrice = this.quote.plan.benefits.find(
          (benefit) => benefit.code === this.graphSelected.Code
        ).intValue
      }

      return [
        this.graphSelected.minPrice,
        this.graphSelected.medianPrice,
        selectedBenefitPrice,
        this.graphSelected.averagePrice,
        this.graphSelected.maxPrice,
      ]
    },
    hasDeductible() {
      return this.quote.plan.deductible && this.quote.plan.deductible >= 0
    },
    planName() {
      let carrierName = this.quote.carrier.name.replaceAll(' ', '')
      return this.quote.plan.name.replace(carrierName, '')
    },
    deductible() {
      return this.hasDeductible ? this.quote.plan.deductible : 'N/A'
    },
    activeFab() {
      return this.showGraph
        ? { color: 'error', icon: 'mdi-chevron-up' }
        : { color: 'primary', icon: 'mdi-chevron-down' }
    },

    /* detailsUrl() {
      return (
        'https://www.quotit.net/quotit/apps/Common/BenefitDetails.aspx' +
        `?familyID=${familyId}&carrierID=${carrierId}&planID=${planId}&premium=${premium}&license_no=0G67800&brokerID=${brokerId}&insuranceTypeID=6&currPremium=&periodID=211&paymentOption=M&baseRateUnitId=0&numberOfDays=0`
      )
    }, */
    ...mapActions(['addToCompare', 'removeFromCompare']),
    ...mapGetters(['compare']),
  },
}
</script>

<style lang="scss">
.v-select__selection--comma {
  text-overflow: unset !important;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}

.dollar-sign {
  top: -0.4em;
  font-size: 0.9rem;
  line-height: 1.2rem;
  margin-right: -6px;
  font-weight: 400;
}
.text-dollar {
  font-family: 'Lato' !important;
  font-size: 1.85rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
}
.text-dollar-sm {
  font-family: 'Lato' !important;
  font-size: 1rem !important;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: normal !important;
}
.text-dollar-sm-graph {
  font-family: 'Lato' !important;
  font-size: 6px !important;
  font-weight: 400;
  //line-height: 1.5rem;
  letter-spacing: normal !important;
}

.neumorphic {
  height: 150px;
  width: 150px;
  border-radius: 50px;
  background: #ffffff;
  box-shadow: 15px 15px 30px #d9d9d9, -15px -15px 30px #ffffff !important;
}

.box {
  position: relative;
  max-width: 800px !important;
  width: 90%;
  background-color: #fff;
  background-size: 100%;
}

.ribbon {
  width: 120px;
  height: 120px;
  overflow: hidden;
  position: absolute;
}

.ribbon::before,
.ribbon::after {
  position: absolute;
  z-index: -1;
  content: '';
  display: block;
  border: 5px solid inherit;
}

.ribbon span {
  position: absolute;
  display: block;
  width: 180px;
  padding: 12px 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: 'Raleway', sans-serif;
  letter-spacing: 0.15555557em !important;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  text-align: center;
}
.ribbon-top-left {
  top: -8px;
  right: -8px;
}

.ribbon-top-left::before,
.ribbon-top-left::after {
  border-top-color: transparent !important;
  border-left-color: transparent !important;
}

.ribbon-top-left::before {
  top: 0;
  left: 0;
}
.ribbon-top-left::after {
  bottom: 0;
  right: 0;
}
.ribbon-top-left span {
  left: -20px;
  top: 24px;
  transform: rotate(45deg);
}

.text-subtitle-1 {
  font-family: 'Raleway', sans-serif !important;
}
</style>
