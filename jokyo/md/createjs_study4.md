# Create.js を使ったデジタル数学教材作成4

## 表の操作

### 表の作成

まず、jqueryで表を作成する。

htmlでtableを表示したい箇所に、以下のように記述する。


```
<table border="1">
  <tr id="value1"><th>value1</th></tr>
  <tr id="value2"><th>value2</th></tr>
</table>

```

このままだと表示が見づらいので、cssで調整する（お好み）。headタグの中に、以下のように書く。


```
<style>
  td {
    width: 50px;
  }
  th {
    width: 100px;
    padding: 10px 0px;
  }
</style>

```

tickの処理よりも前に、以下のように記述する。詳細はコメントの通り。


```
var tdArray = []; //<td>要素をオブジェクトとして格納する配列を作る
var tr = $("#value1"); //idがvalue1の要素をオブジェクトとして、変数trに格納する
for ( var i=0; i<10; i++ ) { //今回は、とりあえず10個
  var td = $("<td>"); //<td>要素を作成する
  tdArray.push(td); //td要素を配列に追加する
  tr.append(td); //同様にtd要素をtrに追加する
}

```

以下のように書くと、テーブルに値が格納されていく。なお、事前にvar k=0;のように宣言しておくこと。


```

if ( k < 10 ) {
  tdArray[k].text( y );  // yはtableに格納したい値
  k++;
}

```







