import Vue from 'vue'; // node_modulesの中のvueをインポートしている。
import VueRouter from 'vue-router'; // node_modulesの中のvue-routerをインポートしている。

import routes from 'TodoRouterDir/routes'; // TodoRouterDirの中のroutes.jsをインポートしてきている。extensionで拡張子なしでもいいとしているので、routesで取ってこれる。
// import routes from 'TodoVuexDir/routes';
// import store from 'TodoVuexDir/store';
// import routes from 'VuexSample/routes';
// import store from 'VuexSample/store';

import '../scss/global.scss';// sassファイルを読み込んできている。reset,baseのscssを読み込んでいて他のファイルでも適用するため。index.htmlにバンドルする内容に含めたいからここで記述している。
// import myApp from './first';
// import myApp from 'TodoDir';// webpack.config.babel.jsの中で指定しているエイリアスの中のTodoDirをインポートしてきている。
import myApp from 'TodoRouterDir';// webpack.config.babel.jsの中で指定しているエイリアスの中のTodoRouterDirをインポートしてきている。
// import myApp from 'TodoVuexDir';
// import myApp from 'VuexSample';

Vue.use(VueRouter);// vueRouterプラグインを使用するというvue.jsの記述。
const router = new VueRouter({// 引数はオブジェクトでインポートしてきた下記が記述されています。 containerのroutes.jsに詳細を書いている。
  routes,// ルートの設定が書かれている配列  routes/jsの内容を適用している。
  mode: 'history',// モード  webpack.config.babel.jsのdevserverの中のhistoryApiFallback: true,によって変更した際に読み込みをしてもエラーにならなくなる。
});

new Vue({
  el: '#app',
  router, // ルーティングのインスタンスをvueインスタンスを作成時に渡している。
  // store,
  render: h => h(myApp), // renderに返したvueインスタンスを返している。hは引数。画面に出している。返されたものが、htmlのidに描画している。
  //renderメソッドを使うことで、ユーザーへのレスポンスとして送信すべき内容を指定することができます
  // render: h => h(myApp), は↓の書き方を短くしたもの
  // render: function (createElement) {
  //   return createElement(myApp)
  // }
});
