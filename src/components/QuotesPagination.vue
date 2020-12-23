<template>
  <div>
    <v-data-iterator
      :items="quotes"
      :items-per-page.sync="itemsPerPage"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      :search="search"
      :page="page"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="primary" flat>
          <!-- <v-select
              multiple
              v-model="filterBy"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-filter-menu"
              label="Filter results"
            ></v-select> -->
          <v-btn
            class="text-none"
            :input-value="showFilter"
            large
            text
            color="white"
            @click.stop="showFilter = !showFilter"
            >Filter results
          </v-btn>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              style="max-width: 200px"
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-sort"
              label="Sort by"
            ></v-select>

            <!-- <v-select
              v-model="filterBy"
              flat
              solo-inverted
              hide-details
              :items="filters"
              prepend-inner-icon="mdi-filter-variant"
            ></v-select> -->
            <v-btn-toggle color="white" active-class="accent--text" group v-model="sortDesc">
              <v-btn large :value="false">
                <v-icon>mdi-sort-ascending</v-icon>
              </v-btn>
              <v-btn large :value="true">
                <v-icon>mdi-sort-descending</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-navigation-drawer v-model="showFilter" floating permanent app width="300" clipped>
          <v-row justify="center" class="filter-menu">
            <v-col cols="12" v-for="key in Object.keys(filters)" :key="key">
              <h6 class="text-center subtitle-2">{{ filterHeading(key) }}</h6>
              <v-checkbox
                dense
                class="mt-1"
                hide-details
                v-for="filter in filters[key]"
                :key="filter.value"
                v-model="filterBy[key]"
                :value="filter.value"
                :label="filter.text"
              ></v-checkbox>
            </v-col>
            <v-col cols="auto">
              <h6 class="body-1">Deductible Range</h6>
              <v-range-slider
                :max="deductible.maxPrice"
                hide-details
                v-model="filterBy.deductibleRange"
              >
              </v-range-slider>
            </v-col>
          </v-row>
        </v-navigation-drawer>
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
    </v-data-iterator>
    <v-pagination v-model="page" :length="numberOfPages"></v-pagination>
  </div>
</template>

<script>
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
  },
  components: {
    QuoteCard,
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 10,
      search: '',
      filterBy: {
        carriers: [],
        networks: [],
        planRatings: [],
        deductibleRange: [],
      },
      showFilter: false,
      sortDesc: null,
      sortBy: '',
    }
  },
  computed: {
    numberOfPages() {
      console.log(this.filters)
      console.log(this.filterBy)
      console.log(Object.getOwnPropertyNames(this.filters))
      return Math.ceil(this.quotes.length / this.itemsPerPage)
    },
    keys() {
      return Object.keys(this.quotes[0].plan)
    },
    deductible() {
      return this.config.standardBenefits.find((el) => el.Code === 'ACA1MedicalDrugDeductible')
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    previousPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    filterHeading(key) {
      switch (key) {
        default:
          return key.charAt(0).toUpperCase() + key.substr(1)
        case 'planRatings':
          return 'Levels'
      }
    },
    /* initFilters() {
      let max = (min = 0)
      this.quotes.forEach((quote) => {
        quote.benefits.forEach((benefit) => {
          if (benefit.code === 'ACA1MedicalDrugDeductible' && benefit.value) {
          }
        })
      })
    },
    formatFilters() {
      const header = {
        header: key,
      }
      const divider = {
        divider: true,
      }
      for (const key in this.filters) {
      }
    }, */
  },
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.rotate-icon {
  transform: rotate(180deg);
}
</style>
