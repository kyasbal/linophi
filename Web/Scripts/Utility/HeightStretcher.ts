/// <reference path="../collections.ts" />
class HeightStretcher {
    private extraMargin: number=0;

    public get ExtraMargin() {
        return this.extraMargin;
    }

    public set ExtraMargin(val: number) {
        this.extraMargin = val;
    }
    private targetElement: JQuery;
    public get TargetElement() {
        return this.targetElement;
    }

    private fillOwner: JQuery;

    public get FillOwner() {
        return this.fillOwner;
    }

    private subElements: collections.LinkedList<JQuery>;

    public addSubElement(elem: JQuery) {
        elem.resize(() => { this.updateTargetProperty(); });
        this.subElements.add(elem);
        this.updateTargetProperty();
    }
    constructor(target: JQuery, fillOwner: JQuery) {
        $(window).resize(() => { this.updateTargetProperty(); });
        this.targetElement = target;
        this.fillOwner = fillOwner;
         this.subElements = new collections.LinkedList<JQuery>();
         this.updateTargetProperty();
     }

    updateTargetProperty():void {
        var sumLength: number = 0;
        for (var i = 0; i < this.subElements.size(); i++) {
            sumLength += this.subElements.elementAtIndex(i).height();
        }
        this.targetElement.height(this.fillOwner.height() - sumLength-this.extraMargin);
    }
}

class WidthStretcher {
    private extraMargin: number = 0;

    public get ExtraMargin() {
        return this.extraMargin;
    }

    public set ExtraMargin(val: number) {
        this.extraMargin = val;
    }
    private targetElement: JQuery;
    public get TargetElement() {
        return this.targetElement;
    }

    private fillOwner: JQuery;

    public get FillOwner() {
        return this.fillOwner;
    }

    private subElements: collections.LinkedList<JQuery>;

    public addSubElement(elem: JQuery) {
        elem.resize(() => { this.updateTargetProperty(); });
        this.subElements.add(elem);
        this.updateTargetProperty();
    }
    constructor(target: JQuery, fillOwner: JQuery) {
        $(window).resize(() => { this.updateTargetProperty(); });
        this.targetElement = target;
        this.fillOwner = fillOwner;
        this.subElements = new collections.LinkedList<JQuery>();
        this.updateTargetProperty();
    }

    updateTargetProperty(): void {
        var sumLength: number = 0;
        for (var i = 0; i < this.subElements.size(); i++) {
            sumLength += this.subElements.elementAtIndex(i).width();
        }
        this.targetElement.width(this.fillOwner.width() - sumLength - this.extraMargin);
    }
}