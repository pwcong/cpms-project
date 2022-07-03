<template>
  <p-layout-header class="home-header">
    <div class="home-header-left">
      <div class="system-logo">
        <img v-show="systemLogo" src="@/assets/images/logo_white.svg" alt="logo" />
        <span class="system-name">{{ systemName }}</span>
      </div>
      <img class="system-slogan" src="@/assets/images/header-slogan.svg" alt="logo" />
    </div>

    <div class="home-header-right">
      <issue-feedback />
      <faq />
      <system-support />

      <!-- <div
        v-for="(item, index) of customButtonList"
        :key="index"
        class="button"
        @click="customButtonNav(item)"
      >
        <template v-if="item.badge">
          <p-badge dot :count="item.count">
            <p-icon class="button-icon" :type="item.icon" />
          </p-badge>
        </template>
        <p-icon class="button-icon" :type="item.icon" v-else />
        <span class="button-label">{{ item[customButtonTitleField] }}</span>
      </div> -->

      <p-dropdown overlayClassName="header-dropdown">
        <div class="button">
          <p-avatar class="button-icon" :src="avatar" :size="24" />
          {{ username }}
          <p-icon type="down" />
        </div>

        <div slot="overlay">
          <div class="base-info">
            <p-avatar class="button-icon" :src="avatar" :size="24" />
            <ul class="user-info">
              <li class="company-name">{{ companyName }}</li>
              <li class="user-name">{{ username }}</li>
            </ul>
          </div>

          <p-menu class="header-menu" :selectable="false" @click="handler">
            <!-- <p-menu-item key="goAuth">
              <a target="_self" rel="noopener noreferrer" href="/auth">
                <p-icon type="undo" />{{ locale.backPortal }}
              </a>
            </p-menu-item>
            <p-menu-item key="userCenter">
              <router-link to="/userCenter">
                <p-icon type="user" />{{ locale.userCenter }}
              </router-link>
            </p-menu-item> -->
            <!-- <p-menu-item key="language">
              <p-gt-icon type="translate" />{{ locale.switchLanguage(language) }}
            </p-menu-item> -->
            <p-menu-item key="logout">
              <p-icon type="logout" />{{ locale.exit }}
            </p-menu-item>
          </p-menu>
        </div>
      </p-dropdown>
    </div>

    <p-message-notify
      v-if="messageNotifyEnable"
      :visible.sync="notifyVisible"
      @updateUnreadTotal="notifyUnreadUpdate"
    />
  </p-layout-header>
</template>

<script>
import { mapGetters } from 'vuex';
import system from '@/config/system';
import avatarDefault from '@/assets/images/avatar.png';
import { isURL } from '@/utils';

import SystemSupport from '../system-support';
import IssueFeedback from '../issue-feedback';
import FAQ from '../faq';

// 右上角 通知 按钮配置
const NOTIFY_BUTTON_CONFIG = {
  label: '通知',
  englishLabel: 'notify',
  type: 'notify',
  icon: 'bell',
  badge: true,
  count: 0, // 控制小红点
};
// 右上角 帮助 按钮配置
const HELPER_BUTTON_CONFIG = {
  label: '帮助',
  englishLabel: 'help',
  icon: 'question-circle',
  url: '',
  openNew: true,
};

export default {
  name: 'HomeHeader',
  components: {
    SystemSupport,
    IssueFeedback,
    faq: FAQ,
  },
  data() {
    return {
      system,

      // 启用站内信
      messageNotifyEnable: system.messageNotify,

      // 自定义按钮列表
      customButtonList: [],

      notifyVisible: false,
    };
  },
  computed: {
    ...mapGetters(['language', 'systemName']),

    locale() {
      return require(`./locale/${this.language}`).default;
    },

    systemLogo() {
      try {
        const { sysList } = this.$store.state.poros;
        const currentSystem = sysList.find((item) => item.systemCode === system.code);

        return currentSystem.icon;
      } catch (e) {
        return '';
      }
    },

    customButtonTitleField() {
      return this.language === 'zh_CN' ? 'label' : 'englishLabel';
    },

    avatar() {
      return this.$store.state.user.avatar || avatarDefault;
    },
    username() {
      return this.$store.state.user.name;
    },
    companyName() {
      return this.$store.state.user?.userInfo.companyName;
    },
  },
  methods: {
    handler({ key }) {
      switch (key) {
        case 'language':
          this.$store.dispatch('switchLanguage');
          break;
        case 'logout':
          this.logout();
          break;
      }
    },

    logout() {
      this.$confirm({
        title: this.locale.logoutConfirmTitle,
        content: this.locale.logoutConfirmContent,
        onOk: () => {
          this.$store.dispatch('logout');
        },
        onCancel() {},
      });
    },

    // 自定义按钮点击
    customButtonNav({ type, url, openNew }) {
      // 通知
      if (type === 'notify') {
        this.openNotify();
        return;
      }

      // 其他
      if (!url) {
        this.$message.warning(this.locale.noLinkTips);
        return;
      }

      if (isURL(url)) {
        if (openNew) {
          window.open(url, '_blank');
        } else {
          location.href = url;
        }
      } else {
        if (openNew) {
          const routeUrl = this.$router.resolve({ path: url });
          window.open(routeUrl.href, '_blank');
        } else {
          this.$router.push(url);
        }
      }
    },

    // 站内信
    openNotify() {
      this.notifyVisible = true;
    },
    notifyUnreadUpdate(unreadTotal) {
      // 更新未读信息数量，控制 小红点
      this.$set(NOTIFY_BUTTON_CONFIG, 'count', unreadTotal);
    },
  },
  watch: {
    systemName(val) {
      if (val) {
        document.title = val;
      }
    },
  },

  created() {
    this.customButtonList = [
      HELPER_BUTTON_CONFIG, // 帮助按钮
      ...(system.customButton || []),
    ];

    if (this.messageNotifyEnable) {
      this.customButtonList.unshift(NOTIFY_BUTTON_CONFIG);
    }
  },
};
</script>

<style lang="less" scoped>
.home-header {
  background-image: url('~@/assets/images/header-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  justify-content: space-between;
  color: #ffffff;
  border-bottom: none;
  &-left,
  &-right {
    display: flex;
    align-items: center;
  }

  &-left {
    .system-nav-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      background: @sys-menu-bgcolor;
      cursor: pointer;
      color: @sys-cell-color;
      font-size: 20px;

      .svg-icon {
        margin-right: 0;
      }
    }

    .system-logo {
      display: flex;
      align-items: center;
      margin-left: 20px;
      white-space: nowrap;

      .system-name {
        font-size: 20px;
        font-family: Impact;
        color: #ffffff;
        line-height: 24px;
      }

      img {
        height: 28px;
        width: 28px;
        margin-right: 10px;
      }
    }
    .system-slogan {
      height: 16px;
      margin-left: 24px;
    }
  }

  &-right {
    align-items: center;

    .button {
      display: flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: white;
      }

      &-icon {
        font-size: 14px;

        &.poros-avatar {
          margin-right: 4px;
        }
      }
      &-label {
        margin-left: 5px;
      }
    }
  }
}
</style>
<style lang="less">
.header-dropdown {
  width: 160px;
  box-shadow: 0 2px 6px 0 rgba(100, 101, 102, 0.2);
  border-radius: 4px;
  // border: 1px solid #e6e7ea;
  background-color: #fff;

  .header-menu {
    border-right: none;

    .poros-menu-item {
      margin: 0;
    }
  }

  .base-info {
    display: flex;
    align-items: center;
    padding: 10px 8px;
    border-bottom: 1px solid #f0f1f3;

    .user-info {
      flex: 1;
      width: 0;
      margin-left: 10px;
      margin-bottom: 0;

      li {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
