class AspectRatioStrecher {
    private ratio: number;

    public get Ratio() {
        return this.ratio;
    }

    private isPriortyHeight: boolean;

    public get IsPriortyHeight() {
        return this.isPriortyHeight;
    }

    private target: JQuery;

    public get Target() {
        return this.target;
    }

    constructor(ratio:number,target:JQuery,heightPriorty:boolean) {
        this.ratio = ratio;
        this.target = target;
        this.isPriortyHeight = heightPriorty;
        this.updateTargetSize();
        this.target.resize(() => { this.updateTargetSize(); });
    }

    updateTargetSize() {
        if (this.IsPriortyHeight) {
            this.target.width(this.target.height() / this.Ratio);
        } else {
            this.target.height(this.target.width() * this.Ratio);
        }
    }
}