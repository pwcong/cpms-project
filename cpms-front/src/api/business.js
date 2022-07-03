import { get, post, put, del } from 'poros/http';

/** 获取项目组件列表 */
export function getProjectComponentList(query) {
  return get('/api/cpms/projectComponentConfig/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
/** 获取项目组件流程类型 */
export function getProjectComponentProcessType(query) {
  return get('/api/cpms/projectComponentConfig/getProcessType', query).then(
    (res) => res.data || {}
  );
}

/** 获取项目组件详情 */
export function getProjectComponentDetail(id) {
  return get(`/api/cpms/projectComponentConfig/${id}`, {}).then((res) => res.data || {});
}

/** 删除项目组件列表 */
export function delProjectComponent(id) {
  return del(`/api/cpms/projectComponentConfig/${id}`, {}).then((res) => res.data || {});
}

/** 提交项目组件表单 */
export function postProjectComponentForm(form) {
  return post('/api/cpms/projectComponentConfig', form).then((res) => res.data || {});
}

/** 修改项目组件表单 */
export function putProjectComponentForm(form) {
  return put('/api/cpms/projectComponentConfig', form).then((res) => res.data || {});
}

/** 获取项目组件类型 */
export function getProjectComponentType(query) {
  return get('/api/cpms/projectComponentConfig/getComponentType', query).then(
    (res) => res.data || {}
  );
}

/** 获取项目阶段列表 */
export function getProjectStageList(query) {
  return get('/api/cpms/projectStageConfig/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取项目阶段详情 */
export function getProjectStageDetail(id) {
  return get(`/api/cpms/projectStageConfig/${id}`, {}).then((res) => res.data || {});
}

/** 删除项目阶段 */
export function delProjectStage(id) {
  return del(`/api/cpms/projectStageConfig/${id}`, {}).then((res) => res.data || {});
}

/** 提交项目阶段表单 */
export function postProjectStageForm(form) {
  return post('/api/cpms/projectStageConfig', form).then((res) => res.data || {});
}

/** 修改项目阶段表单 */
export function putProjectStageForm(form) {
  return put('/api/cpms/projectStageConfig', form).then((res) => res.data || {});
}

/** 新增项目阶段组件配置 */
export function postProjectStageComponentForm(form) {
  return post('/api/cpms/projectStageComponentConfig', form).then(
    (res) => res.data || {}
  );
}

/** 修改项目阶段组件配置 */
export function putProjectStageComponentForm(form) {
  return put('/api/cpms/projectStageComponentConfig', form).then((res) => res.data || {});
}

/** 删除项目阶段组件配置 */
export function delProjectStageComponent(ids) {
  return del(`/api/cpms/projectStageComponentConfig/${ids}`, {}).then(
    (res) => res.data || {}
  );
}

/** 获取项目类型列表 */
export function getProjectTypeList(query) {
  return get('/api/cpms/projectTypeConfig/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取项目类型列表（新） */
export function getNewProjectTypeList(query) {
  return get('/api/cpms/projectTypeConfig/newPageList', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取项目类型详情 */
export function getProjectTypeDetail(id) {
  return get(`/api/cpms/projectTypeConfig/${id}`, {}).then((res) => res.data || {});
}

/** 删除项目类型 */
export function delProjectType(id) {
  return del(`/api/cpms/projectTypeConfig/${id}`, {}).then((res) => res.data || {});
}

/** 提交项目类型表单 */
export function postProjectTypeForm(form) {
  return post('/api/cpms/projectTypeConfig', form).then((res) => res.data || {});
}

/** 修改项目类型表单 */
export function putProjectTypeForm(form) {
  return put('/api/cpms/projectTypeConfig', form).then((res) => res.data || {});
}

/** 获取项目列表 */
export function getProjectList(query) {
  return get('/api/cpms/projectMain/list', query).then((res) => ({
    ...res,
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
/** 获取所有项目列表 */
export function getAllProjectList(query) {
  return get('/api/cpms/projectMain/get-project-all-list', query).then((res) => ({
    ...res,
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取项目列表（含报表） */
export function getProjectReportList(query) {
  return get('/api/cpms/projectMain/getProjectReportList', query).then((res) => ({
    ...(res.data || {}),
    data: ((res.data || {}).dtoPageResult || {}).records,
    totalSize: ((res.data || {}).dtoPageResult || {}).total,
  }));
}

/** 获取项目查重列表 */
export function getProjectCheckList(query) {
  return get('/api/cpms/projectMain/projectCheck', query).then((res) => ({
    ...res,
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取项目报表 */
export function getProjectReport(query) {
  return get('/api/cpms/projectMain/getProjectReport', query).then(
    (res) => res.data || {}
  );
}

/** 获取项目详情 */
export function getProjectDetail(id) {
  return get(`/api/cpms/projectMain/${id}`, {}).then((res) => res.data || {});
}

/** 提交项目表单 */
export function postProjectForm(form) {
  return post('/api/cpms/projectMain/add', form).then((res) => res.data || {});
}

/** 修改项目表单 */
export function putProjectForm(form) {
  return put('/api/cpms/projectMain', form).then((res) => res.data || {});
}

/** 提交项目干系人表单 */
export function postProjectStakeholderForm(form) {
  return post('/api/cpms/projectStakeholderList', form).then((res) => res.data || {});
}

/** 修改项目干系人表单 */
export function putProjectStakeholderForm(form) {
  return put('/api/cpms/projectStakeholderList', form).then((res) => res.data || {});
}

/** 废弃项目干系人 */
export function putProjectStakeholderInvalid(ids) {
  return put(`/api/cpms/projectStakeholderList/invalid/${ids}`, {}).then(
    (res) => res.data || {}
  );
}

/** 提交项目地址表单 */
export function postProjectAddressForm(form) {
  return post('/api/cpms/projectAddressList', form).then((res) => res.data || {});
}

/** 废弃项目地址 */
export function putProjectAddressInvalid(ids) {
  return put(`/api/cpms/projectAddressList/invalid/${ids}`, {}).then(
    (res) => res.data || {}
  );
}

/** 获取阶段跟进数据 */
export function getProjectMainStageList(query) {
  return get(`/api/cpms/projectStageList/list`, query).then((res) => res.data || {});
}

/** 变更为当前阶段 */
export function putProjectChangeStageForm(form) {
  return put(`/api/cpms/projectStageList/changeStage`, form).then(
    (res) => res.data || {}
  );
}

/** 推进到下一阶段 */
export function postProjectChangeStage(form) {
  return post(`/api/cpms/projectStageList/propelNextStage`, form).then(
    (res) => res.data || {}
  );
}

/** 阶段数据保存 */
export function postProjectStageSave(form) {
  return post(`/api/cpms/projectStageList/stageSave`, form).then((res) => res.data || {});
}

/** 项目推进状态查询 */
export function getProjectFollowList(query) {
  return get(`/api/cpms/projectMain/getProjectAdvanceState`, query).then((res) => ({
    ...(res.data || {}),
    data: (res.data || {}).projectAdvanceListDtoList || [],
  }));
}

/** 项目关闭 */
export function postCloseProject(form) {
  return post(`/api/cpms/projectMain/closeProject`, form).then((res) => res.data || {});
}

/** 项目更改项目负责人 */
export function postChangeProjectManager(form) {
  return post(`/api/cpms/projectMain/changeProjectManager`, form).then(
    (res) => res.data || {}
  );
}

/** 根据id作废项目类型 */
export function delAbabdonProjectType(ids) {
  return del(`/api/cpms/projectTypeConfig/${ids}`, {}).then((res) => res.data || {});
}

/** 根据id作废项目类型 */
export function getComponentInfoList(query) {
  return post(`/api/cpms/projectStageList/getComponentInfoList`, query).then(
    (res) => res.data || {}
  );
}

/** 获取项目产品列表 */
export function getProjectProductList(query) {
  return get(`/api/cpms/projectProductList/list`, query).then((res) => ({
    data: (res.data || {}).records,
  }));
}

/** 获取项目状态 */
export function getProjectStatus(query) {
  return get(`/api/cpms/projectMain/getProjectStatus`, query).then(
    (res) => res.data || {}
  );
}

/** 获取项目跨区状态 */
export function postProjectIsRegion(query) {
  return post(`/api/cpms/projectMain/get-is-region`, query).then((res) => res.data || {});
}

/** 根据申请人获取商务中心信息 */
export function getBusinessCenter() {
  return get(`/api/cpms/projectMain/get-business-center`, {}).then(
    (res) => res.data || {}
  );
}

/** 基础报表-项目报备统计表 */
export function getInfoEntryReportList(query) {
  return get(`/api/cpms/project-main-report/list`, query).then((res) => ({
    ...res,
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
