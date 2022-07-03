import api from '@/api';
import { buildSelectionBase } from '@/components/selection-base';
import { buildPropsHOC } from '@/utils';

export default buildPropsHOC(
  {
    props: {
      fdVisitType: {
        type: String,
        default: '',
      },
      fdModuleTypeId: {
        type: String,
        default: '',
      },
    },
    watch: {
      fdModuleTypeId(v) {
        this.onRefresh();
      },
      fdVisitType(v) {
        this.onRefresh();
      },
    },
    mixins: [buildSelectionBase()],
  },
  'selection-visitor',
  {
    getOptions: {
      type: Function,
      default: (_, query) => {
        const { fdVisitType, fdModuleTypeId } = _;
        if (!fdVisitType || !fdModuleTypeId) {
          return Promise.resolve({
            data: [],
          });
        }
        if (fdVisitType == 'cust') {
          return api.customer.getCustomerDetail(fdModuleTypeId).then((res) => {
            return {
              ...res,
              data: (res.contactDtoList || []).map((d) => ({
                ...d,
                label: `${d.fdContactName} /  ${d.fdContactMobile || d.fdContactPhone} /  ${d.fdContactPost}`,
                text: d.fdContactName,
                value: d.id,
                phone: d.fdContactMobile || d.fdContactPhone,
                position: d.fdContactPost,
              })),
            };
          });
        } else if (fdVisitType == 'clue') {
          return api.clue.getClueDetail(fdModuleTypeId).then((res) => {
            return {
              ...res,
              data: (res.otherContacts || []).map((d) => ({
                ...d,
                label: `${d.fdContactName} /  ${d.fdContactPhone} /  ${' '}`,
                text: d.fdContactName,
                value: d.id,
                phone: d.fdContactPhone,
                position: '',
              })),
            };
          });
        } else if (fdVisitType == 'project') {
          return api.business.getProjectDetail(fdModuleTypeId).then((res) => {
            return {
              ...res,
              data: (res.stakeholderListDtoList || []).map((d) => ({
                ...d,
                label: `${d.fdName} /  ${d.fdMobile} /  ${d.fdPosition}`,
                text: d.fdName,
                value: d.id,
                phone: d.fdMobile,
                position: d.fdPosition,
              })),
            };
          });
        }
      },
    },
  }
);
