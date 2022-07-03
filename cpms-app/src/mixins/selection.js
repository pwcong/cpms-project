export const ESelectionValueType = {
  OBJECT: 'OBJECT',
  ARRAY: 'ARRAY',
};

export function buildSelectionMixin(options) {
  options = Object.assign({}, options);

  const { valueType = ESelectionValueType.OBJECT, relation = [] } = options;

  let defaultValue = options.defaultValue;
  if (defaultValue === undefined) {
    defaultValue = valueType === ESelectionValueType.OBJECT ? {} : [];
  }

  const getValue =
    options.getValue ||
    ((_, value) => {
      if (valueType === ESelectionValueType.OBJECT) {
        return Object.assign({}, defaultValue, value || {});
      }
      return [].concat(defaultValue).concat(value || []);
    });

  return {
    name: 'selection-mixin',
    props: {
      mode: {
        type: String,
      },
      readonly: {
        type: Boolean,
      },
      value: {
        type: valueType === ESelectionValueType.OBJECT ? Object : Array,
        default: () => defaultValue,
      },
      visible: {
        type: Boolean,
      },
    },
    data() {
      return {
        tempValue: getValue(this, this.$props.value),
        selectionContainer: () => document.body,
      };
    },
    methods: {
      onOk(done = true) {
        this.$emit('input', this.tempValue);
        this.$emit('change', this.tempValue);
        !!done && this.$emit('update:visible', false);
        !!done && this.$emit('close');
      },
      onCancel() {
        this.$emit('update:visible', false);
        this.$emit('close');
      },
    },
    watch: {
      value: {
        deep: true,
        handler() {
          this.tempValue = getValue(this, this.$props.value);
        },
      },
      visible(v, ov) {
        if (!ov && v) {
          this.tempValue = getValue(this, this.$props.value);
        }
      },
      ...relation.reduce((p, c) => {
        p[c] = function () {
          this.tempValue = getValue(this, this.$props.value);
        };
      }, {}),
    },
  };
}
