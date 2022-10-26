<template>
  <div class="">
    <v-list class="pa-3" dense>
      <v-list-item-group v-model="selectedItem" class="bg-white">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          @click="nextQuestion(i)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "TableComponent",
  data() {
    return {
      selectedItem: 0,
      drawer: null,
      items: [
        { text: "Page1" },
        { text: "Page2" },
        { text: "Page3" },
        { text: "Page4" },
        { text: "Page5" },
        { text: "Page6" },
        { text: "Page7" },
        { text: "Page8" },
      ],
    };
  },
  methods: {
    nextQuestion(i) {
      this.$root.$emit("slideChanged", i);
    },
  },
  mounted() {
    this.$root.$on("pageIndicator", (i) => {
      console.log('ppp')
      this.selectedItem = i
    });
  },
};
</script>

<style lang="scss" scoped>
</style>