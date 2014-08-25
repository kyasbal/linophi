var AspectRatioStrecher = (function () {
    function AspectRatioStrecher(ratio, target, heightPriorty) {
        var _this = this;
        this.ratio = ratio;
        this.target = target;
        this.isPriortyHeight = heightPriorty;
        this.updateTargetSize();
        this.target.resize(function () {
            _this.updateTargetSize();
        });
    }
    Object.defineProperty(AspectRatioStrecher.prototype, "Ratio", {
        get: function () {
            return this.ratio;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AspectRatioStrecher.prototype, "IsPriortyHeight", {
        get: function () {
            return this.isPriortyHeight;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AspectRatioStrecher.prototype, "Target", {
        get: function () {
            return this.target;
        },
        enumerable: true,
        configurable: true
    });

    AspectRatioStrecher.prototype.updateTargetSize = function () {
        if (this.IsPriortyHeight) {
            this.target.width(this.target.height() / this.Ratio);
        } else {
            this.target.height(this.target.width() * this.Ratio);
        }
    };
    return AspectRatioStrecher;
})();
//# sourceMappingURL=AspectRatioStretcher.js.map
