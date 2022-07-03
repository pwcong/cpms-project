import { get, post, put, del } from 'poros/http';

// 合同查询列表页
export function getContractList(query) {
  return get('/api/cpms/projectContractMain/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
// 合同新增页面
export function postContractCreate(form) {
  return post('/api/cpms/projectContractMain', form).then((res) => res.data || {});
}
// 合同编辑页面
export function putContractEdit(form) {
  return put('/api/cpms/projectContractMain', form).then((res) => res.data || {});
}
// 合同详情页面
export function getContractDetail(id) {
  return get(`/api/cpms/projectContractMain/${id}`, {}).then((res) => res.data || {});
}
// 废弃
export function delContractMain(ids) {
  return del(`/api/cpms/projectContractMain/${ids}`, {}).then((res) => res.data || {});
}

// 合同状态
export function getContractStatus(query) {
  return get('/api/cpms/projectContractMain/getStatus', query).then((res) => ({
    data: Object.keys(res.data || {}).map((key) => ({
      key,
      value: (res.data || {})[key],
    })),
    totalSize: (res.data || {}).total,
  }));
}
