<template>
  <p-config-provider :locale="locale">
    <div id="app" :class="{ 'iframe-open': isIframeOpen }">
      <router-view />
    </div>
  </p-config-provider>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { isIframeOpen } from '@/utils'

  export default {
    name: 'App',
    data () {
      return {
        isIframeOpen
      }
    },
    computed: {
      ...mapGetters(['language']),

      locale () {
        return require(`poros/ui/lib/locale-provider/${this.language}`).default
      }
    },
    created () {
      this.$store.dispatch('getLanguageCache')
    }
  }
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  display: flex;

  &.iframe-open {
    padding: 20px 16px 0;
  }
}
</style>
