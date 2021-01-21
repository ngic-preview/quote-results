<template>
  <v-row justify="center">
    <v-dialog :value="showCompare" persistent :max-width="compareLength < 1 ? '50%' : '87.5%'">
      <v-card>
        <v-card-title class="">
          Compare Plans
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon @click="$store.dispatch('toggleCompare')" color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-data-table
          v-if="compareLength > 1"
          disable-filtering
          :items="compareItems"
          :headers="compareHeaders"
          class="elevation-1"
        >
        </v-data-table>
        <v-card-text class="pt-4 pb-10 text-body-1 text-center grey--text text--darken-3" v-else>
          Please select two or more plans to begin comparing.
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    let benefitsOptions = this.config.standardBenefits.concat(this.config.selectedBenefits)
    return {
      compareItemsArray: [],
      compareHeadersArray: [],
      benefitsOptions,
    }
  },
  methods: {},
  computed: {
    compareItems() {
      let formatted = []
      this.compare.forEach((quote) => {
        let item = {
          name: quote.plan.name,
        }
        this.compareHeaders.forEach((header) => {
          if (header.value === 'name') return

          let itemValue = 'N/A'

          if (header.value === 'Rate') {
            itemValue = '$' + quote.plan.rate
          }

          quote.plan.benefits
            .filter((benefit) => benefit.code === header.value)
            .forEach((benefit) => {
              if (!benefit.intValue) {
                itemValue = benefit.value
                return
              }
              itemValue = '$' + benefit.intValue
            })

          item[header.value] = itemValue
        })
        formatted.push(item)
      })
      return formatted
    },
    compareHeaders() {
      let headers = [{ text: 'Plan', align: 'start', sortable: false, value: 'name' }]
      this.benefitsOptions.forEach((benefit) => {
        let header = {
          text: benefit.Label,
          value: benefit.Code,
        }
        headers.push(header)
      })
      return headers
    },
    ...mapGetters(['showCompare', 'compare', 'compareLength']),
  },
}
</script>

<style lang="scss" scoped></style>
