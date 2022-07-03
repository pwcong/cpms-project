import { get, post, put, del } from 'poros/http';

//线索 我认领我分配的列表
export function getMyFollowAndClaimList(query) {
  return get('/api/cpms/clueMain/list-my-follow', query).then((res) => ({
    data: res.data || [],
  }));
}

/**线索查询列表*/
export function getMyClueList(query) {
  return get('/api/cpms/clueMain/pageListMyClue', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
/**线索池*/
export function getCluePool(query) {
  return get('/api/cpms/clueMain/clue-pool', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/**线索新增*/
export function postClueForm(form) {
  return post('/api/cpms/clueMain/addClue', form).then((res) => res.data || {});
}

/** 线索编辑 */
export function putClueForm(form) {
  return put('/api/cpms/clueMain', form).then((res) => res.data || {});
}

/** 线索详情 */
export function getClueDetail(id) {
  return get(`/api/cpms/clueMain/${id}`, {}).then((res) => res.data || {});
}

/** 分配线索 */
export function putAllotClue(form) {
  return put(`/api/cpms/clueMain/allotClue`, form).then((res) => res.data || {});
}

/** 释放线索 */
export function putReleaseClue(form) {
  return put(`/api/cpms/clueMain/release`, form).then((res) => res.data || {});
}

/** 认领线索 */
export function putFollowClue(form) {
  return put(`/api/cpms/clueMain/followClue`, form).then((res) => res.data || {});
}
/** 作废线索 */
export function putDiscardClue(form) {
  return put(`/api/cpms/clueMain/discard`, form).then((res) => res.data || {});
}
/** 获取当前登陆人部门信息 */
export function getDepartments() {
  return get(`/api/poros-permission/secStaff/getCurUser`).then((res) => res.data || {});
}

//获取所属机构
export function getAffiliations() {
  return get(`/api/cpms/baseAgency/list`).then((res) => res.data || {});
}

//获取线索导入模板
export function getExportModule() {
  return get(`/api/cpms/clueMain/export-module/normal`);
}

/**业务线索查询列表*/
export function getPageListMyClue(query) {
  return get('/api/cpms/clueMain/pageListMyClue', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
//线索池省
export function getMylistProvinceList(query) {
  return get('/api/cpms/baseProvince/my-list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
// 线索删除
export function putClueDelete(form) {
  return put(`/api/cpms/clueMain/del`, form).then((res) => res.data || {});
}
