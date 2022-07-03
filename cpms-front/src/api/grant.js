import { get, post, put, del } from 'poros/http';

/** 获取项目授权列表 */
export function getProjectGrantList(query) {
  return get('/api/cpms/projectGrantMain/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取项目授权详情 */
export function getProjectGrantDetail(id) {
  return get(`/api/cpms/projectGrantMain/${id}`, {}).then((res) => res.data || {});
}

/** 提交项目授权表单 */
export function postProjectGrantForm(form) {
  return post('/api/cpms/projectGrantMain', form).then((res) => res.data || {});
}

/** 修改项目授权表单 */
export function putProjectGrantForm(form) {
  return put('/api/cpms/projectGrantMain', form).then((res) => res.data || {});
}
//获取授权状态
export function getProjectGrantState() {
  return get(`/api/cpms/projectGrantMain/get-status`).then((res) => res.data || []);
}
// 删除
export function delGrantMain(form) {
  return put(`/api/cpms/projectGrantMain/del`, form).then((res) => res.data || {});
}
