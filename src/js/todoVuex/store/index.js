import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',//厳格モードでは、ミューテーションに不適切なものがあった場合に、エラーを投げるもの。本番環境では、有効にしてるとパフォーマンスが下がるので、やらないほうがいい。
  state: {
    todos: [],
    todoFilter: '',
    targetTodo: {
      id: null,
      title: '',
      detail: '',
      completed: '',
    },
    errorMessage: '',//空にしたもの。
    emptyMessage: '',//空にしたもの。
  },
  getters: {
    // allTodos: (state) => state.todos.length,//todosの中の配列を取って来るもの。
    completedTodos: (state) => state.todos.filter((todo) => todo.completed),
    incompleteTodos: (state) => state.todos.filter((todo) => !todo.completed),
    completedTodosLength: (state, getters) => getters.completedTodos.length,
    incompleteTodosLength: (state, getters) => getters.incompleteTodos.length,
  },
  mutations: {
    setTodoFilter(state, routeName) {
      state.todoFilter = routeName;
    },
    setEmptyMessage(state, routeName) {
      if (routeName === 'completedTodos') {
        state.emptyMessage = '完了済みのやることリストはありません。';// let erroeMessageとなっていたので、そのまま表示するために変更。
      } else if (routeName === 'incompleteTodos') {
        state.emptyMessage = '未完了のやることリストはありません。';// let erroeMessageとなっていたので、そのまま表示するために変更。
      } else {
        state.emptyMessage = 'やることリストには何も登録されていません。';// let erroeMessageとなっていたので、そのまま表示するために変更。
      }
    },
    initTargetTodo(state) {
      state.targetTodo = {
        id: null,
        title: '',
        detail: '',
        completed: false,
      };
    },
    hideError(state) {
      state.errorMessage = '';
    },
    showError(state, payload) {
      if (payload) {
        state.errorMessage = payload.data; // const errorMessage　＝＞ state.errorMessage　帰ってきたデータを表示している。そのままを表示している。
      } else {
        state.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';//stateにエラーを代入
      }
    },
    updateTargetTodo(state, { name, value }) {
      state.targetTodo[name] = value;
    },
    getTodos(state, payload) {
      state.todos = payload.reverse();//返ってきた値を配置を変えて代入。
    },
    addTodo(state, payload) {
      state.todos.unshift(payload);
    },
    showEditor(state, payload) {
      state.targetTodo = Object.assign({}, payload);
    },
    editTodo(state, payload) {
      state.todos = state.todos.map((todoItem) => {
        if (todoItem.id === payload.id) return payload;
        return todoItem;
      });
    },
    deleteTodo(state, payload) {//今回mutationにdeleteTodoを追加。
      state.todos = payload.todos.reverse();//state.todosに帰ってきた値を配置を変えてる。
    },
  },
  actions: {
    setTodoFilter({ commit }, routeName) {
      commit('setTodoFilter', routeName);
      commit('hideError');
    },
    setEmptyMessage({ commit }, routeName) {
      commit('setEmptyMessage', routeName);
    },
    updateTargetTodo({ commit }, { name, value }) {
      commit('updateTargetTodo', { name, value });
      commit('hideError');
    },
    getTodos({ commit }) {
      commit('hideError');
      axios.get('http://localhost:3000/api/todos/').then(({ data }) => {
        // console.log(data.todos);
        // console.log(data);
        commit('getTodos', data.todos);
      }).catch((err) => {
        commit('showError', err.response);
      });
    },
    addTodo({ commit, state }) {
      if (!state.targetTodo.title || !state.targetTodo.detail) {
        commit({
          type: 'showError',
          data: 'タイトルと内容はどちらも必須項目です。',
        });
        return;
      }
      const postTodo = Object.assign({}, {
        title: state.targetTodo.title,
        detail: state.targetTodo.detail,
      });
      axios.post('http://localhost:3000/api/todos/', postTodo).then(({ data }) => {
        commit('addTodo', data);
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    changeCompleted({ commit }, todo) {
      commit('hideError');
      const targetTodo = Object.assign({}, todo);
      axios.patch(`http://localhost:3000/api/todos/${targetTodo.id}`, {
        completed: !targetTodo.completed,
      }).then(({ data }) => {
        commit('editTodo', data);
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    showEditor({ commit }, todo) {
      commit('hideError');
      commit('showEditor', todo);
    },
    editTodo({ commit, state }) {
      commit('hideError');
      const targetTodo = state.todos.find(todo => todo.id === state.targetTodo.id);
      if (
        targetTodo.title === state.targetTodo.title
        && targetTodo.detail === state.targetTodo.detail
      ) {
        commit('initTargetTodo');
        return;
      }
      axios.patch(`http://localhost:3000/api/todos/${state.targetTodo.id}`, {
        title: state.targetTodo.title,
        detail: state.targetTodo.detail,
      }).then(({ data }) => {
        commit('editTodo', data);
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    deleteTodo: function({ commit }, payload) {
      commit('initTargetTodo');
      commit('hideError');//hideErrorのmutationを呼び出し
      axios.delete(`http://localhost:3000/api/todos/${payload}`).then(function({ data }) {
        const payload = {todos:data.todos};//todosのキーを変数payloadで定義している。
        commit('deleteTodo', payload);//deleteTodoのmutationをpayloadを渡して呼び出し。
        // 処理
      }).catch(function(err) {
        commit('showError', err.response);// 通信失敗時の処理。ここでエラー表示に処理が回っている。
        // 処理
      });
      // 必要があれば処理
    },
  },
});

export default store;
