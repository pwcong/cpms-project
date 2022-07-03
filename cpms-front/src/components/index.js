import ListLayout from './list-layout';
import TabsLayout from './tabs-layout';
import Block from './block';
import { buildSelectBase } from './select-base';
import SelectAddress from './select-address';
import SelectionAMap from './selection-amap';
import Uploader from './uploader';
import SelectDict, { DictText } from './select-dict';
import ExportWrapper from './download-wrapper';
import Barcode from './barcode';
import Stepper from './stepper';

export default {
  install(Vue) {
    Vue.component(ListLayout.name, ListLayout);
    Vue.component(TabsLayout.name, TabsLayout);
    Vue.component(Block.name, Block);

    const SelectBase = buildSelectBase();
    Vue.component(SelectBase.name, SelectBase);

    Vue.component(SelectAddress.name, SelectAddress);
    Vue.component(SelectionAMap.name, SelectionAMap);
    Vue.component(Uploader.name, Uploader);
    Vue.component(SelectDict.name, SelectDict);
    Vue.component(DictText.name, DictText);

    Vue.component(ExportWrapper.name, ExportWrapper);
    Vue.component(Barcode.name, Barcode);
    Vue.component(Stepper.name, Stepper);
  },
};
