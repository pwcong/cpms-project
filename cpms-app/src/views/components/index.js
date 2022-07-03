import AuditInfo from './audit-info';
import AuditRecord from './audit-record';
import FollowRecord from './follow-record';
import ModifyRecord from './modify-record';
import MoreInfo from './more-info';
import StatusTag from './status-tag';
import OASubmitWrapper from './oasubmit-wrapper';

export default {
  install(Vue) {
    Vue.component(AuditInfo.name, AuditInfo);
    Vue.component(AuditRecord.name, AuditRecord);
    Vue.component(FollowRecord.name, FollowRecord);
    Vue.component(ModifyRecord.name, ModifyRecord);
    Vue.component(MoreInfo.name, MoreInfo);
    Vue.component(StatusTag.name, StatusTag);
    Vue.component(OASubmitWrapper.name, OASubmitWrapper);
  },
};
