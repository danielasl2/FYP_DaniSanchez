<template>
  <div>
    <b-list-group-item button @click="toggleCollapse">
      {{ categoryName }} ({{ cookies.length }})
    </b-list-group-item>
    <b-collapse :id="collapseId" v-model="isCollapsed">
      <b-card>
  <div v-if="cookies.length > 0">
    <b-table :items="cookies" :fields="cookieFields">
          <template #cell(blockToggle)="data">
            <input type="checkbox" v-model="data.item.blockedStatus" @change="toggleBlockStatus(data.item)">
          </template>
        </b-table>
        </div>
  <div v-else>
    No cookies available.
  </div>

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
  computed: {
    storedCookies() {
      return this.$store.state.cookies; 
    }
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