/// <reference path="../collections.ts" />
var HeightStretcher = (function () {
    function HeightStretcher(target, fillOwner) {
        var _this = this;
        this.extraMargin = 0;
        $(window).resize(function () {
            _this.updateTargetProperty();
        });
        this.targetElement = target;
        this.fillOwner = fillOwner;
        this.subElements = new collections.LinkedList();
        this.updateTargetProperty();
    }
    Object.defineProperty(HeightStretcher.prototype, "ExtraMargin", {
        get: function () {
            return this.extraMargin;
        },
        set: function (val) {
            this.extraMargin = val;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(HeightStretcher.prototype, "TargetElement", {
        get: function () {
            return this.targetElement;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(HeightStretcher.prototype, "FillOwner", {
        get: function () {
            return this.fillOwner;
        },
        enumerable: true,
        configurable: true
    });

    HeightStretcher.prototype.addSubElement = function (elem) {
        var _this = this;
        elem.resize(function () {
            _this.updateTargetProperty();
        });
        this.subElements.add(elem);
        this.updateTargetProperty();
    };

    HeightStretcher.prototype.updateTargetProperty = function () {
        var sumLength = 0;
        for (var i = 0; i < this.subElements.size(); i++) {
            sumLength += this.subElements.elementAtIndex(i).height();
        }
        this.targetElement.height(this.fillOwner.height() - sumLength - this.extraMargin);
    };
    return HeightStretcher;
})();

var WidthStretcher = (function () {
    function WidthStretcher(target, fillOwner) {
        var _this = this;
        this.extraMargin = 0;
        $(window).resize(function () {
            _this.updateTargetProperty();
        });
        this.targetElement = target;
        this.fillOwner = fillOwner;
        this.subElements = new collections.LinkedList();
        this.updateTargetProperty();
    }
    Object.defineProperty(WidthStretcher.prototype, "ExtraMargin", {
        get: function () {
            return this.extraMargin;
        },
        set: function (val) {
            this.extraMargin = val;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(WidthStretcher.prototype, "TargetElement", {
        get: function () {
            return this.targetElement;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(WidthStretcher.prototype, "FillOwner", {
        get: function () {
            return this.fillOwner;
        },
        enumerable: true,
        configurable: true
    });

    WidthStretcher.prototype.addSubElement = function (elem) {
        var _this = this;
        elem.resize(function () {
            _this.updateTargetProperty();
        });
        this.subElements.add(elem);
        this.updateTargetProperty();
    };

    WidthStretcher.prototype.updateTargetProperty = function () {
        var sumLength = 0;
        for (var i = 0; i < this.subElements.size(); i++) {
            sumLength += this.subElements.elementAtIndex(i).width();
        }
        this.targetElement.width(this.fillOwner.width() - sumLength - this.extraMargin);
    };
    return WidthStretcher;
})();
//# sourceMappingURL=HeightStretcher.js.map
