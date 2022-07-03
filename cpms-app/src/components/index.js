import MenuList from './menu-list';
import ListLayout from './list-layout';
import TabsLayout from './tabs-layout';
import PictureUploader from './picture-uploader';
import Uploader from './uploader';
import Block from './block';
import Tree from './tree';
import PickerArea from './picker-area';
import { buildSelectionBase } from './selection-base';
import SelectionAMap from './selection-amap';
import SelectionDict, { DictText } from './selection-dict';
import SelectionUser from './selection-user';
import SelectionOrg from './selection-org';
import TreeselectArea from './treeselect-area';
import FilterBase from './filter-base';
import FilterTrigger from './filter-base/trigger';
import CardList from './card-list';
import Barcode from './barcode';
import DataGrid from './data-grid';
import Calendar from './calendar';

export default {
  install(Vue) {
    Vue.component(MenuList.name, MenuList);

    Vue.component(ListLayout.name, ListLayout);
    Vue.component(TabsLayout.name, TabsLayout);
    Vue.component(PictureUploader.name, PictureUploader);
    Vue.component(Uploader.name, Uploader);
    Vue.component(Block.name, Block);
    Vue.component(CardList.name, CardList);
    Vue.component(Tree.name, Tree);

    Vue.component(PickerArea.name, PickerArea);

    const SelectionBase = buildSelectionBase();
    Vue.component(SelectionBase.name, SelectionBase);
    Vue.component(SelectionAMap.name, SelectionAMap);

    Vue.component(SelectionDict.name, SelectionDict);
    Vue.component(DictText.name, DictText);
    Vue.component(SelectionUser.name, SelectionUser);
    Vue.component(SelectionOrg.name, SelectionOrg);

    Vue.component(TreeselectArea.name, TreeselectArea);

    Vue.component(FilterBase.name, FilterBase);
    Vue.component(FilterTrigger.name, FilterTrigger);
    Vue.component(Barcode.name, Barcode);
    Vue.component(DataGrid.name, DataGrid);
    Vue.component(Calendar.name, Calendar);
  },
};
