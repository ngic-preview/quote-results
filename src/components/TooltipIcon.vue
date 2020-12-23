<template>
  <v-tooltip max-width="300" color="blue-grey" bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon class="pb-1" x-small top color="indigo" v-bind="attrs" v-on="on">
        mdi-help-circle-outline
      </v-icon>
    </template>
    <span>{{ message }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss">
</style>
