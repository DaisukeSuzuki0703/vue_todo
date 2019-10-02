import Vue from 'vue';  //node_moduleの中のvueをインポートしている。
// import VueRouter from 'vue-router';

// import routes from 'TodoRouterDir/routes';
// import routes from 'TodoVuexDir/routes';
// import store from 'TodoVuexDir/store';
// import routes from 'VuexSample/routes';
// import store from 'VuexSample/store';

import '../scss/global.scss';//srcフォルダのtodoファイルのindex.jsの中のstyleタグで囲まれたscssをインポートしている。

// import myApp from './first';
import myApp from 'TodoDir';//webpack.config.babel.jsの中で指定しているエイリアスの中のTodoDirをインポートしてきている。
// import myApp from 'TodoRouterDir';
// import myApp from 'TodoVuexDir';
// import myApp from 'VuexSample';

// Vue.use(VueRouter);
// const router = new VueRouter({
//   routes,
//   mode: 'history',
// });

new Vue({
  el: '#app',
  // router,
  // store,
  render: h => h(myApp),//renderに返したvueインスタンスを返している。hは引数。
  //enderメソッドを使うことで、ユーザーへのレスポンスとして送信すべき内容を指定することができます
  // render: h => h(myApp), は↓の書き方を短くしたもの
  // render: function (createElement) {
  //   return createElement(myApp)
  // }
});
