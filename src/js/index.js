import Vue from 'vue'; // node_modulesの中のvueをインポートしている。
import VueRouter from 'vue-router'; // node_modulesの中のvue-routerをインポートしている。n

// import routes from 'TodoRouterDir/routes'; // TodoRouterDirの中のroutes.jsをインポートしてきている。extensionで拡張子なしでもいいとしているので、routesで取ってこれる。
import routes from 'TodoVuexDir/routes';// TodoVuexrDirの中のroutes.jsをインポートしてきている。extensionで拡張子なしでもいいとしているので、routesで取ってこれる。
import store from 'TodoVuexDir/store';//TodoVuexDirの中のroutes.jsをインポートしてきている。extensionで拡張子なしでもいいとしているので、storeで取ってこれる。
// import routes from 'VuexSample/routes';
// import store from 'VuexSample/store';

import '../scss/global.scss';// sassファイルを読み込んできている。reset,baseのscssを読み込んでいて他のファイルでも適用するため。index.htmlにバンドルする内容に含めたいからここで記述している。
// import myApp from './first';
// import myApp from 'TodoDir';// webpack.config.babel.jsの中で指定しているエイリアスの中のTodoDirをインポートしてきている。
// import myApp from 'TodoRouterDir'; // webpack.config.babel.jsの中で指定しているエイリアスの中のTodoRouterDirの中のindex.vueをインポートしてきている。
import myApp from 'TodoVuexDir'; // webpack.config.babel.jsの中で指定しているエイリアスの中のTodoVuexDirの中のindex.vueをインポートしてきている。
// import myApp from 'VuexSample';


Vue.use(VueRouter);// vueRouterプラグインを使用するというvue.jsの記述。インスタンス作る前に宣言してあげるのが条件。
const router = new VueRouter({// 引数はオブジェクトでインポートしてきた下記が記述されています。 containerのroutes.jsに詳細を書いている。
  routes,// ルートの設定が書かれている配列  routes/jsの内容を適用している。routes:routs
  mode: 'history',// モード  webpack.config.babel.jsのdevserverの中のhistoryApiFallback: true,によって変更した際に読み込みをしてもエラーにならなくなる。
});

new Vue({
  el: '#app',
  router, // ルーティングのインスタンスをvueインスタンスを作成時に渡している。
  store,//インスタンスでstoreの中で管理しているものを使用できるようにしている。
  render: h => h(myApp), // renderに返したvueインスタンスを返している。hは引数。画面に出している。返されたものが、htmlのidに描画している。
  //renderメソッドを使うことで、ユーザーへのレスポンスとして送信すべき内容を指定することができます
  // render: h => h(myApp), は↓の書き方を短くしたもの
  // render: function (createElement) {
  //   return createElement(myApp)
  // }
});
