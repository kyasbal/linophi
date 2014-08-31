interface JQuery {
    caret():CaretInfo;
    draggable(p: { helper: string }): any;
    droppable(p: { accept: string;hoverClass: string;drop: (event, ui) => void }): any
}
interface CaretInfo {
    begin: number;
    end:number;
}