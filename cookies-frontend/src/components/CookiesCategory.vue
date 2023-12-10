<template>
  <div>
    <b-list-group-item button @click="toggleCollapse">
      {{ categoryName }} ({{ cookies.length }})
    </b-list-group-item>
    <b-collapse :id="collapseId" v-model="isCollapsed">
      <b-card>
        <b-table :items="cookies" :fields="cookieFields"></b-table>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: {
    categoryName: String,
    cookies: Array,
    cookieFields: Array,
    collapseId: String
  },
  data() {
    return {
      isCollapsed: false
    };
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    }
  }
};
</script>