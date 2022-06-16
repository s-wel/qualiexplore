export interface editableTree {
    // id: string;
    name: string;
    checked: boolean;
    value?:{
        description: string,
        source: string,
    }
    childrens: []
}
