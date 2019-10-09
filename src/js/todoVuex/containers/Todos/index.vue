<template lang="html">
  <app-wrapper>
    <app-navi/>
    <app-register v-if="todoFilter !== 'completedTodos'"/>
    <app-error-message v-if="errorMessage"/><!--エラーメッセージがfalseの場合に、DOMごと消えるようにしている。-->
    <template v-slot:todos>
      <app-list
      v-if="todos.length" :todos="todos"/>
      <app-empty-message v-else/><!--watchのallTodoをifで判断させて、DOMごと消えるようにif文を使用している。-->
    </template>
  </app-wrapper>
</template>

<script>
import Wrapper from 'TodoVuexDir/components/Wrapper';
import { ErrorMessage, EmptyMessage } from 'TodoVuexDir/components/Message';
import Register from 'TodoVuexDir/components/Register';
import List from 'TodoVuexDir/components/List';
import Navi from 'TodoVuexDir/components/Navi';

export default {
  components: {
    appWrapper: Wrapper,
    appErrorMessage: ErrorMessage,
    appEmptyMessage: EmptyMessage,
    appList: List,
    appRegister: Register,
    appNavi: Navi,
  },
  computed: {
    todoFilter: function() {
      return this.$store.state.todoFilter;
    },
    todos: function() {
        // console.log(this.todoFilter);
      if (this.todoFilter === 'allTodos') {
        // console.log(this.$store.state.todos.length);
        return this.$store.state.todos;
      }
      // console.log(this.$store.state.todos);
      return this.$store.getters[this.todoFilter];
    },
    errorMessage: function() {
      return this.$store.state.errorMessage;//storeで管理しているerrorMessageを返している。
    },
    // allTodos: function(){//watchのコメントアウトしているものを代用して記述している。
    //   console.log(this.$store.getters['allTodos']);
    //   return this.$store.getters['allTodos'];
    // },
    showEmptyMessage: function(todos) {//watchのコメントアウトしているものを代用して記述している。一度、emptyMesageを判定させるため。
      if (!todos.length) this.$store.dispatch('setEmptyMessage', this.todoFilter);
    }
  },
  watch: {
    todos: function(todos) {
      // console.log(todos);
      // console.log(!todos.length);
      if (!todos.length) this.$store.dispatch('setEmptyMessage', this.todoFilter);
    },
    $route: function(to) {
      this.$store.dispatch('setTodoFilter', to.name);//Naviコンポーネントで指定している、to.nameを引数にしてsetTodoFilterを使用。
    },
  },
  created: function() {
    this.$store.dispatch('getTodos');
    this.$store.dispatch('setTodoFilter', this.$route.name);
  },
};
</script>
