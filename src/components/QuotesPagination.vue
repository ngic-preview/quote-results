<template>
  <div>
    <v-data-iterator
      :items="quotesFiltered"
      :items-per-page.sync="itemsPerPage"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :page="page"
      :search="search"
      hide-default-header
      hide-default-footer
    >
      <template v-slot:default="props">
        <div class="resize-font"></div>
        <v-row>
          <v-col v-for="item in props.items" :key="item.plan.id" cols="12">
            <QuoteCard
              :quote="item"
              :benefitsOptions="config.selectedBenefits"
              :standardBenefits="config.standardBenefits"
            ></QuoteCard>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-row
          style="max-width: 800px; width: 90%"
          class="mx-auto mt-2"
          align="center"
          justify="center"
        >
          <span class="grey--text body-2">Items per page:</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark text color="primary" class="ml-2" v-bind="attrs" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(n, index) in itemPerPageArr"
                :key="index"
                @click="updateItemsPerPage(n)"
              >
                <v-list-item-title> {{ n }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <div class="mr-4">
            <v-btn
              fab
              small
              color="white"
              class="mr-1 btn-fix"
              elevation="2"
              :retain-focus-on-click="false"
              @click="previousPage()"
            >
              <v-icon> mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              small
              elevation="2"
              color="white"
              class="ml-1 btn-fix"
              :retain-focus-on-click="false"
              @click="nextPage()"
            >
              <v-icon> mdi-chevron-right</v-icon>
            </v-btn>
          </div>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text body-2"> Page {{ page }} of {{ numberOfPages }} </span>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QuoteCard from '@/components/QuoteCard.vue'

export default {
  props: {
    quotes: {
      type: Array,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    filters: {
      type: Object,
      required: true,
    },
    search: {
      type: String,
      default: '',
    },
  },
  components: {
    QuoteCard,
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 5,
      itemPerPageArr: [1, 5, 10, 20],
    }
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) {
        this.page += 1
        this.$vuetify.goTo(0)
      }
    },
    updateItemsPerPage(n) {
      this.itemsPerPage = n
    },
    previousPage() {
      if (this.page - 1 >= 1) {
        this.page -= 1
        this.$vuetify.goTo(0)
      }
    },
    checkAgainstFilters(quote) {
      let check = true
      if (this.filters.carriers.length) {
        check = this.filters.carriers.includes(quote.carrier.name)
      }
      if (this.filters.networks.length) {
        check = this.filters.networks.includes(quote.plan.type)
      }
      if (this.config.insuranceType !== 'ShortTerm' && this.filters.planRatings.length) {
        check = this.filters.planRatings.includes(quote.plan.rating)
      }
      return (
        check &&
        quote.plan.rate <= this.filters.premiumMax &&
        quote.plan.deductible <= this.filters.deductibleMax
      )
    },
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
    quotesFiltered() {
      let filteredQuotes = this.quotes.filter((quote) => this.checkAgainstFilters(quote))

      return filteredQuotes
    },
    deductible() {
      return this.config.standardBenefits.find((el) => el.Code === 'ACA1MedicalDrugDeductible')
    },
    premium() {
      return this.config.standardBenefits.find((el) => el.Code === 'Rate')
    },
    numberOfPages() {
      return Math.ceil(this.quotesFiltered.length / this.itemsPerPage)
    },
    ...mapGetters(['compare', 'compareLength', 'sortDesc', 'sortBy']),
  },
}
</script>

<style lang="scss">
//@import '~vuetify/src/styles/styles.sass';

.btn-fix:focus::before {
  opacity: 0 !important;
}

.theme--light.v-btn-toggle:not(.v-btn-toggle--group) .v-btn.v-btn {
  border: none !important;
}
.neumorphed-btn {
  //border-radius: 5px;
  background: #f5f5f5 !important;
  box-shadow: inset 5px 5px 10px #d0d0d0, inset -5px -5px 10px #ffffff !important;
}

.resize-font {
  visibility: hidden;
  position: absolute;
  height: auto;
  width: auto;
  white-space: nowrap;
  font-size: 16px;
  letter-spacing: normal;
  text-align: left;
  font-family: 'Lato', sans-serif;
}

.rotate-icon {
  transform: rotate(180deg);
}
</style>
