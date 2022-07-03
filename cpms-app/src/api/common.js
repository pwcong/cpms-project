import { get, post, put } from 'poros/http';

/** 天眼查模糊查询 */
export function getTianyanchaList(keyword) {
  return get(`/api/cpms/baseTianyancha/getTianyancha816Api/${keyword}`, {}).then((res) => ({
    data: res.data || [],
    totalSize: (res.data || []).length,
  }));
}

/** 获取附件列表 */
export function getFileList(query) {
  return get(`/api/cpms/sysAtt/getFileList`, query).then((res) => ({
    data: res.data || [],
    totalSize: (res.data || []).length,
  }));
}

/** 获取附件详情 */
export function getFileDetail(query) {
  return get(`/api/cpms/sysAtt/get-field-by-id`, query).then((res) => res.data || {});
}

/** 校验地址是否可以转换 */
export function checkAddress(form) {
  return post(`/api/cpms/baseAddressConfig/checkAddress`, form).then((res) => res.data || {});
}

/** 获取审批记录 */
export function getAuditRecord(query) {
  return get(`/api/cpms/oaAuditNote/getOpinion`, query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取操作记录 */
export function getModifyRecord(query) {
  return get(`/api/cpms/commonOperationLog/list`, query).then((res) => ({
    ...res,
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取跟进记录 */
export function getFollowRecord(query) {
  return get(`/api/cpms/spersonFollow/list`, query).then((res) => ({
    ...res,
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 新增跟进记录 */
export function postFollowRecord(form) {
  return post('/api/cpms/spersonFollow', form).then((res) => res.data || {});
}

/** 获取跟进记录 */
export function getAuditInfo(query) {
  return get(`/api/cpms/oaKmReview/getCurHandler`, query).then((res) => res.data || {});
}

/** 获取推送记录接口 */
export function getItfRecordList(query) {
  return get('/api/cpms/itfRecord/record-list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取问题反馈记录 */
export function getQuestionList(query) {
  return get(`/api/cpms/operateQuestionMain/list`, query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取问题反馈状态 */
export function getQuestionStatus(query) {
  return get(`/api/cpms/operateQuestionMain/getQuestionStatus`, {}).then((res) => res.data || {});
}

/** 获取问题反馈详情 */
export function getQuestionDetail(id) {
  return get(`/api/cpms/operateQuestionMain/${id}`, {}).then((res) => res.data || {});
}

/** 新增问题反馈记录 */
export function postQuestionForm(form) {
  return post('/api/cpms/operateQuestionMain', form).then((res) => res.data || {});
}

/** 获取发版日志列表 */
export function getPublishLogList(query) {
  return get(`/api/cpms/publishLog/list`, query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

export function getUserInfo() {
  return get(`/api/poros-permission/secStaff/getCurUser`, {}).then((res) => res.data || {});
}
/** 修改问题反馈记录 */
export function putQuestionForm(form) {
  return put('/api/cpms/operateQuestionMain', form).then((res) => res.data || {});
}

// 撤回单据
export function putWithdrawalWrapper(query) {
  return put('/api/cpms/oaKmReview/withdraw', query).then((res) => res.data || {});
}
