<template>
  <div class="card bg-white px-3 pt-3 mt-3" :class="{'pb-3':!plain}">
    <div class="card-header d-flex ai-center pb-3"
    :class="{'border-bottom':!plain}">
      <i class="iconfont" :class="`icon-${icon}`"></i>
      <div class="fs-xl flex-1 px-2"><strong>{{ title }}</strong></div>
      <i class="iconfont icon-menu"  v-if="!plain"></i>
    </div>
    <div class="card-body"
    :class="{'pt-3':!plain}">
        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    plain: { type: Boolean },
  },
};
</script>
<style lang="scss">
@import '../assets/scss/_variables';
.card{
    border-bottom: 1px solid $border-color;
}
</style>