<template>
  <div class="calendar">
    <div class="calendar-wrapper">
      <div class="calendar-head">
        <van-icon name="arrow-left" @click="handlePrevMonth" />
        <div class="calendar-current">
          <span @click="showYear = true">{{ currentYear }}</span>
          <span @click="showMonth = true">{{ currentMonth }}</span>
        </div>
        <van-icon name="arrow" @click="handleNextMonth" />
      </div>
      <table class="calendar-main">
        <thead>
          <tr class="calendar-weeks">
            <th class="calendar-week" v-for="(item, index) in weeks" :key="index">
              <slot name="week" :value="item">
                {{ item.text }}
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr class="calendar-dates" v-for="(list, index) in dates" :key="index">
            <td class="calendar-date" v-for="(item, _index) in list" :key="_index">
              <template v-if="item !== undefined">
                <slot name="date" :value="item">
                  {{ item.date() }}
                </slot>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <van-popup v-model="showYear" position="bottom">
      <picker-year show-toolbar title="选择年" @confirm="handleSelectYear" @cancel="showYear = false" />
    </van-popup>
    <van-popup v-model="showMonth" position="bottom">
      <picker-month show-toolbar title="选择月" @confirm="handleSelectMonth" @cancel="showMonth = false" />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { buildSelectionMixin } from '@/mixins';
import PickerYear from '@/views/components/picker/year';
import PickerMonth from '@/views/components/picker/month';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: dayjs().startOf('d'),
  getValue: (_, value) => value,
});

export const WEEKS = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
};

export default {
  name: 'calendar',
  mixins: [selectionMixin],
  components: {
    PickerYear,
    PickerMonth,
  },
  props: {
    startOfWeek: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showYear: false,
      showMonth: false,
    };
  },
  computed: {
    currentYear() {
      return this.tempValue.format('YYYY年');
    },
    currentMonth() {
      return this.tempValue.format('MM月');
    },
    weeks() {
      return Array.from(new Array(7)).map((_, i) => ({
        value: (i + this.startOfWeek) % 7,
        text: WEEKS[(i + this.startOfWeek) % 7],
      }));
    },
    dates() {
      const startDate = this.tempValue.startOf('M').startOf('d');
      const endDate = this.tempValue.endOf('M').endOf('d');

      const year = startDate.year();
      const month = startDate.month();

      let dates = Array.from(new Array((startDate.day() + 7 - this.startOfWeek) % 7))
        .map(() => undefined)
        .concat(Array.from(new Array(endDate.date())).map((_, i) => dayjs(new Date(year, month, i + 1))));

      dates = dates.concat(Array.from(new Array(7 - (dates.length % 7))).map(() => undefined));

      let result = [],
        i = 0;
      while (i < dates.length) {
        result.push(dates.slice(i, i + 7));
        i += 7;
      }

      return result;
    },
  },
  methods: {
    handleSelectYear(res) {
      this.tempValue = this.tempValue.set('y', parseInt(res.value));
      this.showYear = false;
      this.onOk();
    },
    handleSelectMonth(res) {
      this.tempValue = this.tempValue.set('M', parseInt(res.value));
      this.showMonth = false;
      this.onOk();
    },
    handlePrevMonth() {
      this.tempValue = this.tempValue.subtract(1, 'M');
      this.onOk();
    },
    handleNextMonth() {
      this.tempValue = this.tempValue.add(1, 'M');
      this.onOk();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.calendar {
  &-wrapper {
    padding: 8px;
  }

  &-head {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #dddddd;
  }

  &-current {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;

    span {
      margin: 0 2px;
    }
  }

  &-main {
    width: 100%;
  }

  &-week {
    font-size: 12px;
    color: #666666;
    padding: 4px 0;
    text-align: center;
  }

  &-date {
    font-size: 12px;
    color: #333333;
    text-align: center;
  }
}
</style>
