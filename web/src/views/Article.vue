<template>
  <div class="page-article" v-if="model">
    <div class="d-flex py-3 px-2 border-bottom">
      <div class="iconfont icon-back-line text-blue"></div>
      <strong class="flex-1 text-blue pl-2 pr-4 text-ellipsis">
        {{ model.title }}
      </strong>
      <div class="text-grey fs-xs">2021-01-29</div>
    </div>
    <div v-html="model.body" class="px-4 body fs-xl pt-3">

    </div>
    <div class="px-4 py-5">
      <div class="d-flex ai-center py-2">
        <i class="iconfont icon-lianjie-tianchong fs-xxl text-grey-1"></i>
        <strong class="text-blue fs-lg ml-1">相关资讯</strong>
      </div>
      <div class="pt-2 fs-lg">
        <router-link
          class="py-1"
          :to="`/articles/${item._id}`"
          tag="div"
          v-for="item in model.related"
          :key="item._id"
        >
          {{ item.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { required: true },
  },
  data() {
    return {
      model: null,
    };
  },
  watch:{
    id: 'fetch',
    // id(){
    //   this.fetch();
    // }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get(`articles/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    this.fetch();
  },
};
</script>

<style lang="scss">
.page-article {
  .body {
    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>