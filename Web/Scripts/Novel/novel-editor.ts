module NovelEditer
{
    export class NovelEditer
    {
        
        private static _endOfLineChar: string[] = ["\n"];
        private static _shiftCaretKeys: number[] = [KeyCodes.KeyCode.ArrowRight, KeyCodes.KeyCode.ArrowLeft, KeyCodes.KeyCode.ArrowDown, KeyCodes.KeyCode.ArrowUp];
        //ユーザーが記述してるエディタ
        private _editorTarget: JQuery;
        //縦書きのやつ
        private _previewTarget: JQuery;
        //なにこれわかんね
        private _previewBounds: JQuery;

        private _nextPageFirstParagraph: Paragraph;

        //直前のカレット位置
        private _lastCaret: TextRegion = new TextRegion(0, 0);
        //直前の編集文字列
        private _lastText: string = "";

        //改行コードの位置を示す。
        //テキスト末尾も含む
        private _paragraphList:collections.LinkedList<number>=new collections.LinkedList<number>();

        //段落管理
        private _paragraphManager: ParagraphManager;

        constructor(editorTarget: JQuery, previewTarget: JQuery, previewBounds: JQuery)
        {
            this._previewBounds = previewBounds;
            this._editorTarget = editorTarget;
            this._previewTarget = previewTarget;
            this._editorTarget.keyup((event: JQueryKeyEventObject) => this.saveInput(event));
//            マウスによってキャレットが移動した際は位置を保存しておく
            this._editorTarget.mousedown(() => this.mouseHandler());
            this._editorTarget.mouseup(() => this.mouseHandler());
            this._editorTarget.bind('input propertychange', () => this.textChanged());
            $(".next-page").click(() => { this.gonextPage(); });
            $(".prev-page").click(() => { this.goprevPage(); });
            this._paragraphManager = new ParagraphManager();
            this._paragraphList.add(0);
        }

        textChanged()
        {
            //console.info("textChanged is Called...!:\t"+this._editorTarget.val());
        }

        private _focusLine: string;



        //キー入力による編集文字列変化の反映処理
        saveInput(event: JQueryKeyEventObject)
        {
            console.info("saveInput is Called...!");

            var currentText: string = this._editorTarget.val();//現在のテキスト
            if (currentText != this._lastText)
        {
                var changeInfo: TextChangeInfo = this.checkChangeText(currentText); //変化情報
                //変化してる最初のパラグラフの頭のインデックス
                var changeStartIndexOfText: number;
                if (changeInfo.changeStartParagraphIndex == null) changeStartIndexOfText = 0;
                else changeStartIndexOfText = this.getParagraphStartIndex(changeInfo.changeStartParagraphIndex + 1);

                //変化の最後の次
                var changeEndIndexOfText: number;
                if (changeInfo.changeEndParagrapgIndex == null) changeEndIndexOfText = currentText.length;
                else changeEndIndexOfText = this.getParagraphStartIndex(changeInfo.changeEndParagrapgIndex);
                var changetext: string = currentText.substring(changeStartIndexOfText, changeEndIndexOfText); //変化箇所

                var parag: Paragraph = this._paragraphManager.createParagraphFromText(changetext);

                if (changeInfo.changeStartParagraphIndex == null) //先頭段落が変化してる
                {
                    if (changeInfo.changeEndParagrapgIndex == null) //全段落が変化してる
                    {
                        this._paragraphManager.headParagraph = parag;
                        this._paragraphManager.changeCurrentParagraph(parag);
                        parag.updateParagraphIndex();
                }
                    else //後方に変化してないのがある
                {
                        this._paragraphManager.getParagraphByIndex(changeInfo.changeEndParagrapgIndex).insertPrev(parag);
                }
                }
                else
                {
                    this._paragraphManager.removeParagraphRange(changeInfo.changeStartParagraphIndex, changeInfo.changeEndParagrapgIndex);
                    this._paragraphManager.getParagraphByIndex(changeInfo.changeStartParagraphIndex).insertNext(parag);
                }
            }


            var caret: TextRegion = TextRegion.fromCaretInfo(this._editorTarget.caret());//現在のカレット取得

            for (var j = 0; j < this._paragraphList.size(); j++)
                {
                var num: number = this._paragraphList.elementAtIndex(j);
                if (caret.begin<=num)
                {
                    this._paragraphManager.changeCurrentParagraphByIndex(j);
                    break;
                }
                }




            //if (_.include(NovelEditer._shiftCaretKeys, event.keyCode))
            //{//矢印キーによる移動
            //    console.info("catch [Arrow]");
            //    var subStr: string;
            //    if (this._lastCaret.begin < caret.begin)
            //    {
            //        subStr = this._lastText.substring(this._lastCaret.begin, caret.begin);
            //        var clf: number = this.countLf(subStr);
            //        for (var i = 0; i < clf; i++)
                //        {
            //            this._paragraphManager.moveNext();
                //        }
                //    }
            //    else if (this._lastCaret.begin > caret.begin)
                //    {
            //        subStr = this._lastText.substring(caret.begin, this._lastCaret.begin);
            //        var clf: number = this.countLf(subStr);
            //        for (var i = 0; i < clf; i++)
            //        {
            //            this._paragraphManager.movePrev();
            //        }
                //    }
            //    /*直前と現在の
            //     * カレット位置の間に挟まれる文字列を取得し、その中に現れる改行コード分だけ
            //     * currentをずらす
            //     */
                //}


            this._lastCaret = caret;
            this.updateToshow();

            console.info("\tcurrent       =\t" + this._paragraphManager.currentParagraph.getParagraphIndex() + ":"+
                this._paragraphManager.currentParagraph.rawText);
            //console.info("\tlastCurret:   =\t" + this._lastCaret.begin);
            var str: string = "";
            for (var i = 0; i < this._paragraphList.size(); i++)
            {
                str += ", "+this._paragraphList.elementAtIndex(i);
            }
            console.info("endParag:       \t" + str);
            console.info("\tparagraphCount=\t"+this._paragraphManager.paragraphCount+"\n");
        }

        //テキストの変更箇所を探して、更新します
        checkChangeText(currentText: string):TextChangeInfo
        {
            if (this._lastText == "")//空行から変化
            {
                this._lastText = currentText;
                this._paragraphList.clear();
                for (var l = 0; l < currentText.length; l++)
                {
                    if (currentText.charCodeAt(l) == 0x0a)
                    {
                        this._paragraphList.add(l);
                    }
                }
                this._paragraphList.add(currentText.length);
                return new TextChangeInfo(null,null);
                    }
            if (currentText == "")//全削除
                    {
                this._lastText = "";
                this._paragraphList.clear();
                this._paragraphList.add(0);
                return new TextChangeInfo(null, null);
                    }

            //変更がない
            if (currentText == this._lastText) return new TextChangeInfo(0, 0);

            var parag: Paragraph = this._paragraphManager.headParagraph;
            var changeStart: number = 0;//変更直前段落
            var str: string = currentText;//コピー
            while (true)
            {
                if (parag.isFinalParagraph)
                {
                    if (str != parag.rawText)
                    {
                        if (changeStart == 0)
                    {
                            changeStart = null;
                            break;
                    }
                        changeStart--;
                        break;
                }
                    if (str.substr(0, parag.rawText.length+1) == parag.rawText+"\n")
                        {
                        changeStart = parag.getParagraphIndex();
                        break;
                        }
                    }
                if (str.substr(0, parag.rawText.length+1) == parag.rawText+"\n")
                        {
                    str = str.substr(parag.rawText.length);
                    parag = parag.nextParagraph;
                    continue;
                        }
                if (changeStart == 0)
                {
                    changeStart = null;
                    break;
                    }
                changeStart--;
                break;
                }

            var changeEnd: number = this._paragraphManager.lastParagraphIndex;//最後の変更点の直後の位置
            str = currentText;//コピー
            parag = this._paragraphManager.getParagraphByIndex(this._paragraphManager.lastParagraphIndex);
            while (true)
                    {
                if (parag.isFirstParagraph)
                    {
                    changeEnd = null;
                    break;
                    }
                if (str.substr(str.length - parag.rawText.length-1) == "\n"+parag.rawText)
                    {
                    str = str.substr(0, str.length - parag.rawText.length);
                    parag = parag.prevParagraph;
                    continue;
                }
                if (changeEnd == this._paragraphManager.lastParagraphIndex)
                {
                    changeEnd = null;
                    break;
            }
                changeEnd++;
                break;
        }

            var ret: TextChangeInfo = new TextChangeInfo(changeStart,changeEnd);//帰り値

            //更新処理
            var num = ret.changeStartParagraphIndex;
            if (num == null) num = -1;
            num++;
            while (this._paragraphList.size() > num)
        {
                this._paragraphList.removeElementAtIndex(num);
            }
            for (var k = this.getParagraphStartIndex(num); k < currentText.length; k++)
            {
                if (currentText.charCodeAt(k) == 0x0a)
                {
                    this._paragraphList.add(k);
                }
                }
            this._paragraphList.add(currentText.length);
            this._lastText = currentText;
            return ret;
            }
        //指定段落の開始インデックスを取得
        getParagraphStartIndex(paragraphIndex: number):number
        {
            if (paragraphIndex == 0) return 0;
            return this._paragraphList.elementAtIndex(paragraphIndex - 1) + 1;
        }

        updateToshow() {

            var ml = this._paragraphManager.headParagraph.getParagraphHtmls(this._paragraphManager.paragraphCount);
            this._previewTarget.html(ml);
        }

        //改行の数をカウントする
        countLf(str: string): number
        {
            var count = 0;
            for (var i = 0; i < str.length; i++)
            {
                if (str.charCodeAt(i) == 0x0a)
                {
                    count++;
                }
            }
            return count;
        }

        toJSON():string
        {
            var innerJSON: string = "";
            var cacheParagraph: Paragraph = this._paragraphManager.headParagraph;
            while (true)
            {
                innerJSON += cacheParagraph.toJSON();
                if (!cacheParagraph.isFinalParagraph) innerJSON += ",";
                if(cacheParagraph.isFinalParagraph)break;
                cacheParagraph = cacheParagraph.nextParagraph;
            }
            return "[" + innerJSON + "]";
        }

        mouseHandler()
        {
            //console.info("mouseHandler is Called...!");
            //var caret: TextRegion = TextRegion.fromCaretInfo(this._editorTarget.caret());
            //this._caret = caret;
            //this.updateFocusLine();
            //var region = TextRegion.fromCaretInfo(this._editorTarget.caret());
            //if (!region.isRegion())
            //{
            //    var lfc = this.countLf(this._lastText.substr(0, region.begin));
            //    this.currentParagraphChanged(this._pageFirstParagraph.getParagraph(lfc));
            //    this.updateToshow();
            //}
        }

        gonextPage()
        {
            if (this._nextPageFirstParagraph != null)
            {
                this._paragraphManager.headParagraph = this._nextPageFirstParagraph;
                this.updateToshow();
            }
        }
        goprevPage()
        {
            var i: number = 1;
            var cacheHead: Paragraph = this._paragraphManager.headParagraph;
            if (cacheHead.isFirstParagraph)return;
            while (true)
            {
                cacheHead = cacheHead.prevParagraph;
                while (i <= this._paragraphManager.lastParagraphIndex + 1) {
                    this._previewTarget.html(cacheHead.getParagraphHtmls(i));
                    if (this._previewTarget.width() > this._previewBounds.width()) {
                        this._previewTarget.html(cacheHead.getParagraphHtmls(i - 1));
                        break;
                    }
                    i++;
                }
                var next = cacheHead.getParagraphFromthis(i);
                if(next==this._paragraphManager.headParagraph)break;
                if (cacheHead.isFinalParagraph) break;
                cacheHead = cacheHead.prevParagraph;
            }
            this._paragraphManager.headParagraph = cacheHead;
        }
    }
    export class TextChangeInfo
    {
        changeStartParagraphIndex:number;//変更の先頭の直前の段落、変更が先頭段落からのときはnull
        changeEndParagrapgIndex: number;//変更の末尾の直後の段落、変更が最終段落に及ぶときはnull

        constructor(start: number, end: number)
        {
            this.changeStartParagraphIndex = start;
            this.changeEndParagrapgIndex = end;
        }
    }
    export class ParagraphManager
    {
        private _paragraphDictionary: collections.Dictionary<string, Paragraph> = new collections.Dictionary<string, Paragraph>();
        get ParagraphDictionary(): collections.Dictionary<string, Paragraph>
        {
            return this._paragraphDictionary;
        }
        //先頭の段落
        private _headParagraph: Paragraph;
        //最終段落のインデックス
        private _lastParagraphIndex: number=0;
        //現在の段落
        private _currentParagraph: Paragraph;

        constructor()
        {
            this._headParagraph = new Paragraph(this, "");
            this._lastParagraphIndex = 0;
            this._currentParagraph = this._headParagraph;
        }

        get lastParagraphIndex(): number
        {
            return this._lastParagraphIndex;
        }
        set lastParagraphIndex(index:number)
        {
            this._lastParagraphIndex = index;
        }
        get headParagraph(): Paragraph
        {
            return this._headParagraph;
        }
        set headParagraph(val: Paragraph)
        {
            this._headParagraph = val;
        }
        get currentParagraph(): Paragraph
        {
            return this._currentParagraph;
        }

        //段落数
        get paragraphCount(): number
        {
            return this._lastParagraphIndex + 1;
        }
        //ディクショナリへの登録
        registParagraph(parag: Paragraph)
        {
            if (this._paragraphDictionary.containsKey(parag.getId()))return;
            this._paragraphDictionary.setValue(parag.getId(), parag);
        } 
        //ディクショナリからの解除
        unregistParagraph(id: string)
        {
            this._paragraphDictionary.remove(id);
        }

        //現在の段落(とその強調表示)を変更する
        changeCurrentParagraph(currentParagraph: Paragraph)
        {
            this._currentParagraph.isEmphasized = false;
            this._currentParagraph = currentParagraph;
            this._currentParagraph.isEmphasized = true;
            console.info("currentParagraph:" + currentParagraph.rawText);
        }
        //startからendをつないで、その間を削除。end==nullで後ろ全部
        removeParagraphRange(start: number, end: number)
        {
            var startParag: Paragraph = this.getParagraphByIndex(start);
            var currentIndex:number = this._currentParagraph.getParagraphIndex();
            if (end == null)
            {
                if (start < currentIndex)
                {
                    this.changeCurrentParagraph(startParag);
                }
                startParag.nextParagraph = null;
                startParag.updateParagraphIndex();
                this.refreshRegist();
                return;
            }
            if (start < currentIndex && currentIndex < end) this.changeCurrentParagraph(startParag);
            var endParag: Paragraph = this.getParagraphByIndex(end);
            startParag.nextParagraph = endParag;
            endParag.prevParagraph = startParag;
            this.refreshRegist();
        }
        //toJson():string[]
        //{
        //    this.refreshRegist();
        //    var ret: string[] = new Array(this.lastParagraphIndex + 1);
        //    for (var i = 0; i < ; i++)
        //    {
                
        //    }
        //}

        //登録を再確認
        refreshRegist()
        {
            this._paragraphDictionary.clear();
            this._headParagraph.updateParagraphIndex();
        }
        //現在の段落(とその強調表示)をインデックス指定で変更する
        changeCurrentParagraphByIndex(paragraphIndex: number)
        {
            var parag: Paragraph = this._currentParagraph.getParagraphByIndex(paragraphIndex);
            this.changeCurrentParagraph(parag);
        }

        //現在のパラグラフを次に移動する。現在が末尾だったら何もせずfalse
        moveNext():boolean
        {
            if (this._currentParagraph.isFinalParagraph) return false;
            this.changeCurrentParagraph(this._currentParagraph.nextParagraph);
            return true;
        }
        //現在のパラグラフを前に移動する。現在が先頭だったら何もせずfalse
        movePrev():boolean
        {
            if (this._currentParagraph.isFirstParagraph)return false;
            this.changeCurrentParagraph(this._currentParagraph.prevParagraph);
            return true;
        }
        //末尾に段落を追加する
        addParagraph(parag: Paragraph)
        {
            this.registParagraph(parag);
            if (this._lastParagraphIndex == 0)
            {
                this._headParagraph = parag;
                this._currentParagraph = parag;
                parag.updateParagraphIndex();
                return;
            }
            this._currentParagraph.getLastParagraph().insertNext(parag);
        }
        //指定したインデックスの段落を取得
        getParagraphByIndex(index: number): Paragraph
        {
            return this._headParagraph.getParagraphByIndex(index);
        }
        //テキストを改行で分割してパラグラフに分ける。先頭を返す
        createParagraphFromText(str: string): Paragraph
        {
            var num: number = str.indexOf("\n");//改行を探す
            if (num == -1) return new Paragraph(this, str);//改行がなければそのまま返す

            var parag: Paragraph = new Paragraph(this, str.substr(0, num));//改行の手前まで
            if (num == str.length - 1)//改行が末尾ならそれで返す
            {
                parag.insertNext(new Paragraph(this, ""));
                return parag;
            }
            str = str.substr(num + 1, str.length - num - 1);//改行の後ろ

            while (true)//後ろが""でなければ
            {
                num = str.indexOf("\n");//改行を探す
                if (num == -1)//改行がなければ終了
                {
                    parag.insertNext(new Paragraph(this, str));
                    return parag.getFirstParagraph();
                }
                parag.insertNext(new Paragraph(this, str.substr(0, num)));
                parag = parag.nextParagraph;
                if (num == str.length - 1)//改行が末尾ならそれで返す
                {
                    parag.insertNext(new Paragraph(this, ""));
                    return parag.getFirstParagraph();
                }
                str = str.substr(num + 1, str.length - num - 1);//改行の後ろ
            }
        }
        //指定したカレット位置を段落上のカレット位置に変換する
        getCaretPositionAsParag(caretPos: number):CaretPosition
        {
            var parag: Paragraph = this._headParagraph;
            var paragPos: number = 0;
            while (parag.rawText.length<caretPos)
            {
                if (parag.isFinalParagraph)
                {
                    var ret: CaretPosition = new CaretPosition(paragPos, 0);
                    ret.isParagraphLast = true;
                    ret.isTextLast = true;
                    return ret;
                }
                caretPos -= parag.rawText.length + 1;
                paragPos++;
                parag = parag.nextParagraph;
            }
            var pos: CaretPosition = new CaretPosition(paragPos, caretPos);
            if (parag.rawText.length == caretPos)//段落末尾
            {
                pos.isParagraphLast = true;
                if (pos.paragraphIndex == this._lastParagraphIndex)pos.isTextLast = true;
            }
            return pos;
        }
        //現在のカレットの編集文字列を再読み込み
        reLoadParagraph(text: string, caretPos: number)
        {
            this._currentParagraph.paragraphReload(text, caretPos);
        }
    }

    export class Paragraph implements IParagraph
    {
        private static _IdString: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        //マークアップ付の生テキスト
        private _rawText: string;
        //段落管理クラス
        private _manager: ParagraphManager;
        //前の段落
        prevParagraph: Paragraph;
        //次の段落
        nextParagraph: Paragraph;
        //段落番号(先頭は0)
        private _paragraphIndex: number = 0;
        //生成されたHTML
        private _cacheHtml: string;
        //強調表示フラグ
        private _isEmphasized: boolean = false;
        //ID
        private _iD: string="Not Implemented!";

        constructor(manager: ParagraphManager, rawText: string)
        {
            this._manager = manager;
            this._rawText = rawText;
            this._iD = this.generateId();
            this.updateCacheHtml();
        }

        getPrevParagraph():IParagraph
        {
            return this.prevParagraph;
        }

        getNextParagraph(): IParagraph
        {
            return this.nextParagraph;
        }

        getCachedHtml(): string
        {
            return this._cacheHtml;
        }

        getParagraphIndex(): number
        {
            return this._paragraphIndex;
        }
        getId(): string
        {
            return this._iD;
        }

        generateId(): string
        {
            var id = "";
            for (var i = 0; i < 10; i++)
            {
                id+=Paragraph._IdString.substr(Math.floor(Math.random()*Paragraph._IdString.length),1);
            }
            return id;
        }

        toJSON(): string//じっそうしといて
        {
            var jsonObj: any = {
                prevParagraph: this.isFirstParagraph ? null : this.prevParagraph.getId(),
                nextParagraph: this.isFinalParagraph ? null : this.nextParagraph.getId(),
                rawText: this.rawText,
                paragraphIndex: this._paragraphIndex,
                id:this._iD
            };
            return JSON.stringify(jsonObj);
        }
        fromJSON(jsonObj:any): void//じっそうしといて
        {
            if (jsonObj.prevParagraph != null && this._manager.ParagraphDictionary.containsKey  (jsonObj.prevParagraph))
            {
                this.prevParagraph = this._manager.ParagraphDictionary.getValue(jsonObj.prevParagraph);
                this.prevParagraph.nextParagraph = this;
            }
            if (jsonObj.nextParagraph != null && this._manager.ParagraphDictionary.containsKey(jsonObj.nextParagraph)) {
                this.nextParagraph = this._manager.ParagraphDictionary.getValue(jsonObj.nextParagraph);
                this.nextParagraph.prevParagraph = this;
            }
            this.rawText = jsonObj.rawText;
            this.updateCacheHtml();
            this._paragraphIndex = jsonObj.paragraphIndex;
            this._iD = jsonObj.id;
            if (!this._manager.ParagraphDictionary.containsKey(this._iD))
            {
                this._manager.ParagraphDictionary.setValue(this._iD, this);
            }
        }
        set isEmphasized(isem: boolean)
        {
            this._isEmphasized = isem;
            this.updateCacheHtml();
        }

        get isEmphasized(): boolean
        {
            return this._isEmphasized;
        }

        get rawText(): string
        {
            return this._rawText;
        }
        set rawText(raw: string)
        {
            this._rawText = raw;
            this.updateCacheHtml();
        }

        //これが最終段落か否か
        get isFinalParagraph(): boolean
        {
            return this.nextParagraph == null;
        }

        //これが最初の段落か否か
        get isFirstParagraph(): boolean
        {
            return this.prevParagraph == null;
        }

        //HTML再生成
        updateCacheHtml()
        {
            var prefixes: any[] = [new TitlePrefix(), new DividerPrefix()];
            var tag: JQuery;
            var rawStr: string = this._rawText;
            rawStr.replace(" ", "&ensp;"); //半角スペースは特殊文字として置き換える
            if (Utils.StringUtility.isEmpty(this._rawText))
            {
                this._cacheHtml = "<br/>";
                return;
            }
            var isPrefixed: boolean = false;
            for (var i = 0; i < prefixes.length; i++)
            {
                if (prefixes[i].isPrefixOfMe(rawStr))
                {
                    tag = $(prefixes[i].getFormattedHtml(rawStr));
                    isPrefixed = true;
                    break;
                }
            }
            var markups: any[] = [new QuoteMarkup(),new BoldMarkup(),new LinkMarkup()];
            for (var j = 0; j < markups.length; j++)
            {
                rawStr = markups[j].getMarkupString(rawStr);
            }
            if (!isPrefixed)
            {
                tag = $("<p/>");
                //エスケープ処理
                if (rawStr.charCodeAt(0) == 0x5c && rawStr.length > 1 && rawStr.charCodeAt(1) == 0x5c) rawStr = "\\" + rawStr.substr(2, rawStr.length - 2); //\\の場合は\にする
                else if (rawStr.charCodeAt(0) == 0x5c && rawStr.charCodeAt(1) != 0x5c)
                {
                    rawStr = rawStr.substr(1, rawStr.length - 1);
                }

                tag.html(rawStr);
            }
           
            tag.addClass("p-" + this._paragraphIndex);
            if (this.isEmphasized) tag.addClass("em");
            this._cacheHtml = $("<div/>").append(tag).html();
        }
        //段落番号と最終段落番号の更新。常に整合性を保つ
        updateParagraphIndex()
        {
            this._manager.registParagraph(this);
            if (this.prevParagraph != null)
            {
                this._paragraphIndex = this.prevParagraph._paragraphIndex + 1;
            }
            else
            {
                this._paragraphIndex = 0;
                this._manager.headParagraph = this;
            }
            if (!this.isFinalParagraph) this.nextParagraph.updateParagraphIndex();
            else this._manager.lastParagraphIndex = this._paragraphIndex;
        }

        //指定した段落をこの段落の直後に挿入
        insertNext(next: Paragraph)
        {
            this._manager.registParagraph(next);
            if (!this.isFinalParagraph)
            {
                var last: Paragraph = next.getLastParagraph();
                last.nextParagraph = this.nextParagraph;
                this.nextParagraph.prevParagraph = last;
            }
            next.prevParagraph = this;
            this.nextParagraph = next;
            next.updateParagraphIndex();
        }
         //指定した段落をこの段落の直前に挿入
        insertPrev(prev: Paragraph)
        {
            this._manager.registParagraph(prev);
            if (!this.isFirstParagraph)
            {
                prev.prevParagraph = this.prevParagraph;
                this.prevParagraph.nextParagraph = prev;
            }
            var last: Paragraph = prev.getLastParagraph();
            last.nextParagraph = this;
            this.prevParagraph = last;
            prev.updateParagraphIndex();
        }
        //指定したインデックスの段落を取得
        getParagraphByIndex(index: number): Paragraph
        {
            if (!this.isFirstParagraph) return this._manager.headParagraph.getParagraphByIndex(index);
            var parag: Paragraph = this;
            for (var i = 0; i < index; i++)
            {
                if (parag.nextParagraph == null)return parag.nextParagraph;
                parag = parag.nextParagraph;
            }
            return parag;
        }

        getParagraphFromthis(dest: number): Paragraph
        {
            var parag: Paragraph = this;
            for (var i = 0; i < dest; i++)
            {
                if (parag.nextParagraph == null) return parag.nextParagraph;
                parag = parag.nextParagraph;
            }
            return parag;
        }
        //この段落リストの末尾を取得
        getLastParagraph(): Paragraph
        {
            var parag: Paragraph = this;
            while (!parag.isFinalParagraph)
            {
                parag = parag.nextParagraph;
            }
            return parag;
        }
        //この段落リストの先頭を取得
        getFirstParagraph(): Paragraph
        {
            if (this.isFirstParagraph) return this;
            var parag: Paragraph = this;
            while (!parag.isFirstParagraph)
            {
                parag = parag.prevParagraph;
            }
            return parag;
        }
        //指定した番目までの段落のhtmlを結合して返す。
        getParagraphHtmls(count: number): string
        {
            var cachedHtml: string = this._cacheHtml;
            var currentParagraph: Paragraph = this;
            //JSだと再帰でやるとすぐにメモリ無くなるのでforでやる
            for (var i = 0; i < count && !currentParagraph.isFinalParagraph; i++)
            {
                currentParagraph = currentParagraph.nextParagraph;
                cachedHtml += currentParagraph._cacheHtml;
            }
            return cachedHtml;
        }
        //生テキストを結合して返す。
        getParagraphRawTexts(count: number): string
        {
            var cachedRawText: string = this.rawText;
            var currentParagraph: Paragraph = this;
            //JSだと再帰でやるとすぐにメモリ無くなるのでforでやる
            for (var i = 0; i < count && !currentParagraph.isFinalParagraph; i++)
            {
                currentParagraph = currentParagraph.nextParagraph;
                cachedRawText += "\n"+currentParagraph.rawText;//改行をはさんでおく
            }
            return cachedRawText;
        }
        //この段落を削除する
        removeThis()
        {
            this._manager.unregistParagraph(this._iD);
            if (this.isFinalParagraph)
            {
                if (this.isFirstParagraph)//この行しかないとき
                {
                    this.rawText = "";
                    this.updateParagraphIndex();
                    return;
                }
                this.prevParagraph.nextParagraph = null;
                this._manager.lastParagraphIndex--;
                if (this._manager.currentParagraph == this) this._manager.changeCurrentParagraph(this.prevParagraph);
                return;
            }
            if (this.isFirstParagraph)
            {
                this.nextParagraph.prevParagraph = null;
                this.nextParagraph.updateParagraphIndex();
                if (this._manager.currentParagraph == this) this._manager.changeCurrentParagraph(this.nextParagraph);
                return;
            }
            else
            {
                this.prevParagraph.nextParagraph = this.nextParagraph;
                this.nextParagraph.prevParagraph = this.prevParagraph;
                this.nextParagraph.updateParagraphIndex();
                if (this._manager.currentParagraph == this) this._manager.changeCurrentParagraph(this.prevParagraph);
            }
        }
        //この段落の指定した位置で、この段落を二つの段落に分ける。分けた前半の段落を返す
        sepalateParagraph(pos: number):Paragraph
        {
            var front: Paragraph = new Paragraph(this._manager, this._rawText.substr(0, pos));
            var back: Paragraph = new Paragraph(this._manager, this._rawText.substr(pos, this._rawText.length - pos));

            if (this._manager.currentParagraph == this) this._manager.changeCurrentParagraph(back);

            front.nextParagraph = back;
            back.prevParagraph = front;

            this.removeThis();
            if (!this.isFinalParagraph)
            {
                back.nextParagraph = this.nextParagraph;
                this.nextParagraph.prevParagraph = back;
            }
            if (!this.isFirstParagraph)
            {
                front.prevParagraph = this.prevParagraph;
                this.prevParagraph.nextParagraph = front;
                //this.prevParagraph.insertNext(front);
                //return front;
            }
            front.updateParagraphIndex();
            this._manager.unregistParagraph(this._iD);
            this._manager.registParagraph(front);
            this._manager.registParagraph(front.nextParagraph);
            return front;
        }

        //文字列の指定したカレット位置を含むように段落文を再構成します
        paragraphReload(text: string, caretPos: number) {
            var begin: number = caretPos;
            var end = caretPos;
            for (var i = caretPos-1; i >=0; i--) {
                if (text.charCodeAt(i) == 0x0a) break;
                begin = i;
            }
            for (var j = caretPos; j < text.length+1; j++) {
                end = j;
                if (text.charCodeAt(j) == 0x0a) break;
            }
            var subtext: string = text.substring(begin, end);
            this._rawText = subtext;
            this.updateCacheHtml();
        }

        toString(): string
        {
            return this.rawText;
        }
    }

    class PrefixBase
    {
        isPrefixOfMe(str: string): boolean
        {
            if (str.charCodeAt(0) == 0x5c) return false; //最初が\のときエスケープする
            if (Utils.StringUtility.startWith(str, this.getPrefixString())) return true;
            return false;
        }

        getPrefixString(): string
        {
            return "Not Implemented!";
        }

        getFormattedHtml(str: string): string
        {
            var preLength: number = this.getPrefixString().length;
            return this.getFormattedHtmlImpl(str.substr(preLength, str.length - preLength));
        }

        getFormattedHtmlImpl(str: string): string
        {
            return "Not Implemented!";
        }
    }

    class TitlePrefix extends PrefixBase
    {
        getPrefixString(): string
        {
            return "#";
        }

        getFormattedHtmlImpl(str: string): string
        {
            return "<h1>" + str + "</h1>";
        }
    }

    class DividerPrefix extends PrefixBase
    {
        getPrefixString(): string
        {
            return "-";
        }

        getFormattedHtmlImpl(str: string): string
        {
            return "<hr/>";
        }
    }
    //段落上でのカレット位置をあらわすクラス
    export class CaretPosition
    {
        //カレットのある段落位置
        paragraphIndex: number;
        //カレットのある段落での、先頭からの位置
        charIndex: number;
        isTextLast: boolean = false;//テキストの末尾であることを表す。
        isParagraphLast:boolean=false;//段落末尾であることを表す。
        constructor(paragIndex: number, charIndex: number)
        {
            this.paragraphIndex = paragIndex;
            this.charIndex = charIndex;
        }
    }
    //テキストの選択領域を表すクラス
    class TextRegion
    {
        public static fromCaretInfo(caret: CaretInfo): TextRegion
        {
            return new TextRegion(caret.begin, caret.end);
        }

        constructor(begin: number, end: number)
        {
            this.begin = begin;
            this.end = end;
        }

        begin: number;
        end: number;

        public substr(text: string): string
        {
            return text.substr(this.begin, this.end - this.begin);
        }

        public isRegion(): boolean
        {
            return this.begin != this.end;
        }

        public isFirst(): boolean
        {
            return !this.isRegion() && this.begin == 0;
        }

        toString(): string
        {
            return "[" + this.begin + "," + this.end + "]";
        }
    }
}


module KeyCodes
{
    export enum KeyCode
    {
        Enter= 13,
        Home= 36,
        PageUp= 33,
        Delete= 46,
        End= 35,
        PageDown= 34,
        ArrowLeft= 37,
        ArrowUp= 38,
        ArrowRight= 39,
        ArrowDown= 40,
        BackSpace= 8
    }
}

module Utils
{
    export class StringUtility
    {
        static startWith(sourceStr: string, checkStr: string): boolean
        {
            if (sourceStr.length < checkStr.length) return false;
            for (var i = 0; i < checkStr.length; i++)
            {
                if (checkStr.charCodeAt(i) != sourceStr.charCodeAt(i)) return false;
            }
            return true;
        }

        static isEmpty(str: string): boolean
        {
            return str.length == 0 || (str.charCodeAt(0) == 0x0a && str.length == 1);
        }
    }
}