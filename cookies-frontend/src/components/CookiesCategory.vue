<template>
  <div>
    <b-list-group-item button @click="toggleCollapse">
      {{ categoryName }} ({{ cookies.length }})
    </b-list-group-item>
    <b-collapse :id="collapseId" v-model="isCollapsed">
      <b-card>
        <b-table :items="cookies" :fields="cookieFields">
          <template #cell(blockToggle)="data">
            <input type="checkbox" v-model="data.item.blockedStatus" @change="toggleBlockStatus(data.item)">
          </template>
        </b-table>
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
    },
    toggleBlockStatus(cookie){
      this.$emit('update-block-status', {...cookie, blockedStatus: !cookie.blockedStatus});
    }
  }
};
</script>