import Vue from 'vue'
import EOEER from './../assets/404.png'
import LOADING from './../assets/loading-img.gif'
import "vant/lib/index.css"
// import Vant from 'vant';
// (() => {
//     Vue.use(Vant).use(Lazyload, {
//         loading: LOADING,
//         error: EOEER
//     })
// })()
import {
    Loading,
    Tab,
    Tabs,
    Toast,
    Popup,
    CellGroup,
    SwitchCell,
    Collapse,
    CollapseItem,
    Tag,
    Lazyload,
    Cell,
    Icon,
    Search,
    // Actionsheet,
    Field,
    Dialog,
    Checkbox,
    CheckboxGroup,
    Switch,
    Button,
    List,
    Area,
    Picker
} from 'vant';
(() => {
    Vue
        .use(Loading)
        .use(Tab)
        .use(Tabs)
        .use(Toast)
        .use(Popup)
        .use(CellGroup)
        .use(SwitchCell)
        .use(Collapse)
        .use(CollapseItem)
        .use(Tag)
        .use(Lazyload, {
            loading: LOADING,
            error: EOEER
        })
        .use(Cell)
        .use(Icon)
        .use(Search)
        // .use(Actionsheet)
        .use(Field)
        .use(Dialog)
        .use(Checkbox)
        .use(CheckboxGroup)
        .use(Switch)
        .use(Button)
        .use(List)
        .use(Area)
        .use(Picker)
})()