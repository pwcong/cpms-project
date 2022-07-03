<template>
  <div class="menu-list">
    <div class="menu-list-wrapper" v-if="data.length > 0">
      <tree :data="data">
        <template v-slot:item="{ item }">
          <div class="menu">
            <div class="menu-title">
              {{ item.title }}
            </div>
            <div class="menu-btns" @click.stop>
              <span v-if="!item.children" @click="handleGoTo(item)"> 进入页面 </span>
            </div>
          </div>
        </template>
      </tree>
    </div>
    <van-empty image-size="100px" v-else description="暂无菜单项，请联系管理员添加" />
  </div>
</template>

<script>
export default {
  name: 'menu-list',
  props: {
    data: {
      type: Array,
      default: () => [
        // {
        //   title: 'XXX',
        //   path: '/XXX',
        //   children: [
        //     {
        //       icon: YYY,
        //       path: '/XXX/YYY',
        //       title: 'YYY',
        //     },
        //   ],
        // },
      ],
    },
  },
  methods: {
    handleGoTo(item) {
      this.$emit('goto', item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.menu-list {
  background-color: white;
  padding: 10px 0;
  .menu {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;

    &-btns {
      font-size: 12px;
      color: $theme-color;
    }
  }
}
</style>
