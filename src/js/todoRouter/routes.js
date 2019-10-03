import Todos from 'TodoRouterDir/containers/Todos';

const routes = [//ここで、ページの切り替えをしている。（componentがtodoの為、ページ遷移なく、SPAができている。）
  {
    name: 'allTodos',
    path: '/',//パスが/の時に、Todosを表示するという意味。to属性で遷移先のパスの指定をします。（書かれているところは、Naviコンポーネント）
    component: Todos,
  },
  {
    name: 'completedTodos',
    path: '/completed',
    component: Todos,
  },
  {
    name: 'incompleteTodos',
    path: '/incomplete',
    component: Todos,
  },
];
//通常だと、複数のファイルがありそれに対してルーティングの指定がされいることが基本なので覚えておいてください。
//名前を付けたルートにリンクするには、 router-link コンポーネントの to プロパティにオブジェクトを渡します。
//<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
//ページ遷移させるには、componentsフォルダの中のNavi内のindex.vueで表示をしている。

export default routes;//index.jsのnew Vueの中に送っている。
