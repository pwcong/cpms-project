import api from "@/api";

import formMixin, {
  getFormData as getProjectFormData,
} from "../ProjectEdit/form";

function getFormData() {
  return {
    ...getProjectFormData(),
    projectStageList: [],
  };
}

export default {
  mixins: [formMixin],
  data() {
    return {
      formData: getFormData(),
    };
  },
  methods: {
    async initStageData(id) {
      this.loading = true;
      try {
        const { projectTypeId } = this.$route.query;

        if (!!id && !!projectTypeId) {
          const stageList = await api.business
            .getProjectMainStageList({
              fdMainId: id,
              limit: 999,
              pageNo: 1,
              projectTypeId,
            })
            .then((res) => res.records || []);

          this.formData = {
            ...this.formData,
            projectStageList: stageList.sort((a, b) => {
              switch (true) {
                case a.fdSortNum > b.fdSortNum:
                  return 1;
                case a.fdSortNum < b.fdSortNum:
                  return -1;
                default:
                  return 0;
              }
            }),
          };
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
