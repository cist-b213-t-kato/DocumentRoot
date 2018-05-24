# Create.js を使ったデジタル数学教材作成3

## ボタンの実装

### ボタンを作る
まず、ボタンのガワだけを作る。

```
<div class="col-sm-12">
  <canvas id="myCanvas" width="960" height="360"></canvas>
</div>
```
の下に、以下のように書く。

```
<div class="col-sm-12">
  <button id="sinButton" class="btn btn-default">sin波の表示・非表示</button>
  <button id="colorButton" class="btn btn-default">sin波の色を変える</button>
</div>

```

これで一度、ブラウザで表示してみる。ガワだけなので、押されても何もしない。


### sin波の表示・非表示

init関数の中のどこかで、以下のように書く。sinWaveはsin波を表現するシェイプとする。

```
  var colorType = 0;
  document.getElementById('colorButton').addEventListener('click', function() {
    colorType = ( colorType + 1 ) % 2;
    if ( colorType == 0 ) { 
      sinWave.graphics.beginStroke("#FF8888");
    } else if ( colorType == 1 ) {
      sinWave.graphics.beginStroke("#8888FF");
    }
  });

```











