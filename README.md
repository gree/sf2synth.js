sf2synth.js
===========

sf2synth.js は [WebMidiLink](http://www.g200kg.com/en/docs/webmidilink/) 対応の SoundFont シンセサイザです。


## 使い方

```js
var url = './soundfont/A320U.sf2';
var wml = new SoundFont.WebMidiLink();
wml.setLoadCallback(function(arraybuffer) {
    // ロード完了時の処理
});
wml.setup(url);
```


## 対応ブラウザ

最新の Web Audio API 実装を必要とします。

- Google Chrome 25+
- Google Chrome for Android 28+


## WebMidiLink 対応

sf2synth.js は WebMidiLink の Link Level 1 に対応しています。
現在、シンセサイザ固有の情報はありません。


## ライセンス

Copyright &copy; 2013 imaya / GREE Inc.
Licensed under the MIT License.
