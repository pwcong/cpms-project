import { get, post, put, del } from 'poros/http';

//考勤地址列表
export function getClockAddressList(query) {
  return get('/api/cpms/spersonClockAddressConfig/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

//考勤地址新增
export function postClockAddressForm(form) {
  return post('/api/cpms/spersonClockAddressConfig', form).then((res) => res.data || {});
}

//考勤地址编辑
export function putClockAddressForm(form) {
  return put('/api/cpms/spersonClockAddressConfig', form).then((res) => res.data || {});
}

//考勤地址详情
export function getClockAddressDetail(id) {
  return get(`/api/cpms/spersonClockAddressConfig/${id}`, {}).then((res) => res.data || {});
}

//考勤打卡查询列表
export function getClockList(query) {
  return get('/api/cpms/spersonClockRecordMain/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

//外勤打卡查询列表
export function getOutclockList(query) {
  return get('/api/cpms/spersonClockRecordList/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

//外勤打卡新增
export function postOutclockForm(form) {
  return post('/api/cpms/spersonClockRecordList', form).then((res) => res.data || {});
}

//外勤打卡编辑
export function putOutclockForm(form) {
  return put('/api/cpms/spersonClockRecordList', form).then((res) => res.data || {});
}

//考勤新增
export function postClockForm(form) {
  return post('/api/cpms/spersonClockRecordMain', form).then((res) => res.data || {});
}

//考勤编辑
export function putClockForm(form) {
  return put('/api/cpms/spersonClockRecordMain', form).then((res) => res.data || {});
}

//考勤详情
export function getOutclockDetail(id) {
  return get(`/api/cpms/spersonClockRecordList/${id}`, {}).then((res) => res.data || {});
}

//周报查询列表
export function getWeeklyList(query) {
  return get('/api/cpms/spersonWeekly/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

//周报新建
export function postWeeklyForm(form) {
  return post('/api/cpms/spersonWeekly', form).then((res) => res.data || {});
}

//周报详情
export function getWeeklyDetail(id) {
  return get(`/api/cpms/spersonWeekly/${id}`, {}).then((res) => res.data || {});
}

//周报数据
export function getWeeklyData(query) {
  return get(`/api/cpms/spersonWeekly/getWeekData`, query).then((res) => res.data || {});
}

//周报编辑
export function putWeeklyForm(form) {
  return put('/api/cpms/spersonWeekly', form).then((res) => res.data || {});
}

//移动端打卡页面初始化加载
export function postClockAddressMobilePage(form) {
  return post('/api/cpms/spersonClockAddressConfig/mobilePage', form).then((res) => res.data || {});
}

//移动端考勤打卡
export function postClockInForm(form) {
  return post('/api/cpms/spersonClockRecordMain', form).then((res) => res.data || {});
}

//移动端外勤打卡
export function postExternalClockInForm(form) {
  return post('/api/cpms/spersonClockRecordList', form).then((res) => res.data || {});
}

//移动端拜访打卡
export function postVisitClockInForm(form) {
  return post('/api/cpms/spersonVisitMain/clock', form).then((res) => res.data || {});
}

//移动端拜访打卡地址查询
export function getVisitClockInAddress(id) {
  return get(`/api/cpms/spersonVisitMain/visit/${id}`, {}).then((res) => res.data || {});
}

//根据拜访类型获取地址
export function getVisitTypeClockInAddress(query) {
  return get('/api/cpms/spersonVisitMain/visit-address', query).then((res) => res.data || []);
}
//获取所有打卡
export function getAllClockList(query) {
  return get('/api/cpms/spersonClockRecordMain/all-list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

//获取所有的周报
export function getAllWeekly(query) {
  return get('/api/cpms/spersonWeekly/all-list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 拜访计划列表
export function getVisitList(query) {
  return get('/api/cpms/spersonVisitMain/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 拜访计划列表
export function getVisitByIdList(query) {
  return get('/api/cpms/spersonVisitMain/listById', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 拜访新增页面
export function postVisitForm(form) {
  return post('/api/cpms/spersonVisitMain', form).then((res) => res.data || {});
}

// 拜访详情页面
export function getVisitDetail(id) {
  return get(`/api/cpms/spersonVisitMain/byMain/${id}`, {}).then((res) => res.data || {});
}

// 拜访编辑页面
export function putVisitForm(form) {
  return put(`/api/cpms/spersonVisitMain`, form).then((res) => res.data || {});
}

//拜访反馈新增
export function postVisitFeedbackForm(form) {
  return post('/api/cpms/spersonVisitFeedbackList', form).then((res) => res.data || {});
}

//拜访反馈修改
export function putVisitFeedbackForm(form) {
  return put('/api/cpms/spersonVisitFeedbackList', form).then((res) => res.data || {});
}

// 拜访反馈详情页面
export function getVisitFeedbackDetail(id) {
  return get(`/api/cpms/spersonVisitFeedbackList/${id}`, {}).then((res) => res.data || {});
}
//获取所有的拜访记录
export function getAllVisitByIdList(query) {
  return get('/api/cpms/spersonVisitMain/all-list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
// 删除
export function delVisitMain(ids) {
  return del(`/api/cpms/spersonVisitMain/${ids}`, {}).then((res) => res.data || {});
}
