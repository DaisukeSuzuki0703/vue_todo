<template lang="html">
  <div class="todo__wrapper">
    <div class="todo__inner">
      <header class="header">
        <h1 class="header__title">やることリスト</h1>
      </header>

      <main class="main">
        <form class="register" @submit.prevent="targetTodo.id ? editTodo() : addTodo()">
          <div class="register__input">
            <p class="register__input__title">やることのタイトル</p>
            <input
              v-model="targetTodo.title"
              type="text"
              name="title"
              placeholder="ここにTODOのタイトルを記入してください"
              required
            >
          </div>
          <div class="register__input">
            <p class="register__input__title">やることの内容</p>
            <textarea
              v-model="targetTodo.detail"
              name="detail"
              rows="3"
              placeholder="ここにTODOの内容を記入してください。改行は半角スペースに変換されます。"
              required
            />
          </div>
          <div class="register__submit">
            <button class="register__submit__btn" type="submit" name="button">
              <!-- 登録する -->
              <template v-if="targetTodo.id">
                <span>変更する</span>
              </template>
              <template v-else>
                <span>登録する</span>
              </template>
            </button>
          </div>
        </form>

        <div v-if="errorMessage" class="error">
          <p class="error__text">{{ errorMessage }}</p>
        </div>


        <div class="todos">
          <template v-if="todos.length">
            <ul class="todos__list">
              <li
                v-for="todo in todos"
                :key="todo.id"
                :class="todo.completed ? 'is-completed' : ''"
              >
                <div class="todos__inner">
                  <div class="todos__completed">
                    <button
                    class="todos__completed__btn"
                    type="button"
                    @click="changeCompleted(todo)"
                    >
                      <template v-if="todo.completed">
                        <span>完了</span>
                      </template>
                      <template v-else>
                        <span>未完了</span>
                      </template>
                    </button>
                  </div>
                  <div class="todos__desc">
                    <h2 class="todos__desc__title">{{ todo.title }}</h2>
                    <p class="todos__desc__detail">{{ todo.detail }}</p>
                  </div>
                  <div class="todos__btn">
                    <button
                      class="todos__btn__edit"
                      type="button"
                      @click="showEditor(todo)"
                    >
                      編集
                    </button>
                    <button
                      class="todos__btn__delete"
                      type="button"
                      @click="deleteTodo(todo.id)"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <p class="todos__empty">やることリストには何も登録されていません。</p>
          </template>
        </div>
      </main>

      <footer class="footer">
        <p>全項目数: {{ todos.length }}</p>
        <p>完了済: {{ todos.filter(todo => todo.completed).length }}</p>
        <p>未完了: {{ todos.filter(todo => !todo.completed).length }}</p>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      todos: [
        {
          id: 1,
          title: 'タイトル 01',
          detail: '詳細 01',
          completed: false,
        },
        {
          id: 2,
          title: 'タイトル 02',
          detail: '詳細 02',
          completed: false,
        },
      ],
      targetTodo: {
        id: null,
        title: '',
        detail: '',
        completed: false,
      },
      errorMessage: '',//data(状態管理)の中のerrorMessageを書き換えているのでここで定義している。
    };
  },
  created() {//Vueインスタンスが作成された後に行う処理ということ。（ライフサイクル）※index.jsのnew Vueが作成されたあと。
    axios.get('http://localhost:3000/api/todos/').then(({ data }) => {//getメソッドで引数で指定しているURLにリクエストを行う記述。
      //{ data }というものは、返ってきたもの（オブジェクト）の中のdataを直接引数として受け取っています。
      this.todos = data.todos.reverse();//帰ってきている値をdataのtodosに入れて、取得してきた配列を逆に表示している。表示の順番を整理するため。
    }).catch((err) => {//通信が失敗したときに引数の関数が実行されます。また通信でのエラーの内容がその関数の引数に入ってきます
    // if (err.response) { APIから返ってくるエラーを取得できるとき。
    //   this.errorMessage = err.response.data.message;
    // } else {
    //   this.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
    // }
        this.showError(err);
    });
  },
  methods: {
    initTargetTodo() {
      return {
        id: null,
        title: '',
        detail: '',
        completed: false,
      };
    },
    hideError() {
      this.errorMessage = '';
    },
    showError(err) {
      if (err.response) {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
      }
    },
    addTodo() {
      const postTodo = Object.assign({}, {//下記のtitle,detailを新しいオブジェクトpostTodoに入れ直している変数。
        title: this.targetTodo.title,
        detail: this.targetTodo.detail,
      });
      //getメソッドはURLに付随して値を送る。POSTメソッドは値はURLにつけず引数として送っている。基本的に大事な情報などは、POSTメソッドを使用する。
      //POSTメソッドは値が他で見れないから。GETメソッドは履歴なども残るようになっている為。
      axios.post('http://localhost:3000/api/todos/', postTodo).then(({ data }) => {//postメソッドの第二引数のpostTodoはリクエストと共に送る情報。
        this.todos.unshift(data);//dataのtodosの中の先頭にunshiftメソッドを使用して追加。
        // this.targetTodo = Object.assign({}, this.targetTodo, { title: '', detail: '' });　dataのtargetTodoに空のtitle,detailが入った新しいオブジェクトを追加している。
        this.targetTodo = this.initTargetTodo();
      }).catch((err) => {//errという引数に処理が失敗した際のデータが入ってくる。
        this.showError(err);//エラー表示をする。
      });
    },
    changeCompleted(todo) {//実行するときにtmlのタグにchangeCompleted(todo)で引数に、対象となるTodoを渡しているので、メソッドを定義してるところで受け取れるようにします。
      // this.targetTodo = {
      //   id: null,
      //   title: '',
      //   detail: '',
      //   completed: false,
      // };
      this.targetTodo = this.initTargetTodo();
      const targetTodo = Object.assign({}, todo);//v-forで回したtodo in todosを変数で置いている。data()内のものではない。
      axios.patch(`http://localhost:3000/api/todos/${targetTodo.id}`, {//PATCHでは既存のデータの上書きを行うので、更新したい項目と値の組を指定する必要があります。
      //${targetTodo.id}は対象のtodoのidを付与したもの、下記はtargetTodoのcompletedの値を反転させた値をリクエストと共に送っている。
        completed: !targetTodo.completed,
      }).then(({ data }) => {
        // console.log(this.todos);
        this.todos = this.todos.map((todoItem) => {//todoItemは変数の引数で置いている。
          if (todoItem.id === targetTodo.id) return data;//帰ってきたデータに置き換えている。クリックした時のtodo.idが同じ場合はクリックしたもの。
          return todoItem;//idが違う場合は、そのままのものを返している。
        });
        // console.log(this.todos);
        this.hideError();//this.errorMessage = '';
      }).catch((err) => {
        this.showError(err);//エラー表示
      });//htmlのタグでも表示したいので、v-ifを使用し未完了、完了の表示分けをしてあげる。
      //liタグにもtodo.completedの真偽でclassの追加などができるよう３項演算子で表示分けをしてあげる
    },
    showEditor(todo) {
      this.targetTodo = Object.assign({}, todo);//対象のtodoを新しいオブジェクトに入れたものをtaegetTodoのリアクティブプロパティに変更している。
    },
    editTodo() {
       const targetTodo = this.todos.find(todo => todo.id === this.targetTodo.id);//変数targetTodoはtodosの中の変数todo.idがリアクティブプロパティのidと等しいものを見つけてきたもの
        if (
          targetTodo.title === this.targetTodo.title//変数targetTodoのtitleがリアクティブプロパティにあるtargetTodoが一緒かつdetalも同じ時。
          && targetTodo.detail === this.targetTodo.detail
        ) {
          // this.targetTodo = {
          //   id: null,
          //   title: '',
          //   detail: '',
          //   completed: false,
          // };
          this.targetTodo = this.initTargetTodo();//何も変化がない場合、表示されているものが初期化される。
          return;
        }
        //${this.targetTodo.idは対象のリアクティブプロパティを付与したものをリクエストで送っている。
      axios.patch(`http://localhost:3000/api/todos/${this.targetTodo.id}`, {//http://localhost:3000/api/todos/${this.targetTodo.id}にPACTHメソッドで、変更後のTodoの中のタイトルと詳細のオブジェクトとともにリクエストを送っています。
        title: this.targetTodo.title,
        detail: this.targetTodo.detail,
      }).then(({ data }) => {//帰ってきている値をdataで受け取っている。
        this.todos = this.todos.map((todo) => {//mapの引数のtodoは変数。
          if (todo.id === this.targetTodo.id) return data;//変数todoのidとリアクティブプロパティのtargetTodoのidが一致した時編集した内容に変更される。
          return todo;//一致しなかった場合、変更前のtodoが表示される。
        });
        // this.targetTodo = {
        //   id: null,
        //   title: '',
        //   detail: '',
        //   completed: false,
        // };
        this.targetTodo = this.initTargetTodo();//変更ボタンを押した場合も初期化する。（表示をからにする。）
        this.hideError();//成功した時エラーの表示を空欄にして表示されないようにする。
      }).catch((err) => {
        this.showError(err);//変更に失敗した時、エラーメッセージを表示している。
      });
    },
    deleteTodo(id) {
      // this.targetTodo = {
      //   id: null,
      //   title: '',
      //   detail: '',
      //   completed: false,
      // };
      this.targetTodo = this.initTargetTodo();//todoに表示されているものを初期化する。
      axios.delete(`http://localhost:3000/api/todos/${id}`).then(({ data }) => {//削除ボタンを押したものの対象のidを付与したものをリクエストで送っている。
        this.todos = data.todos.reverse();//リアクティブプロパティのtodosに帰ってきた値（data.todos）の配列を逆順にしている。
        this.hideError();
      }).catch((err) => {
        this.showError(err);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.todo {
  &__wrapper {
    margin: 0 auto;
    padding: 20px 0;
    width: 700px;
    max-height: 100vh;
  }
  &__inner {
    position: relative;
    max-height: calc(100vh - 40px);
    border-radius: 10px;
    box-shadow: #aaa 0 0 20px 1px;
  }
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 0;
  color: #fff;
  font-size: 16px;
  line-height: 1.2;
  text-align: center;
  border-radius: 10px 10px 0 0;
  background-color: #54b363;
}

.main {
  padding: 78px 0 56px;
  max-height: calc(100vh - 40px);
  overflow: scroll;
  border-radius: 10px;
  background-color: #fff;
}

.register {
  padding: 10px 20px;
  padding-bottom: 0;
  &__inner {
    width: 80%;
  }
  &__input {
    & + & {
      margin-top: 10px;
    }
    &__title {
      font-weight: bold;
      font-size: 14px;
    }
    input, textarea {
      padding: 10px;
      width: 100%;
      font-size: 14px;
      border: 1px solid #ddd;
    }
  }
  &__submit {
    margin-top: 10px;
    text-align: right;
    &__btn {
      padding: 10px 25px;
      color: #fff;
      font-size: 12px;
      border-radius: 7px;
      background-color: #54b363;
    }
  }
}

.error {
  padding: 0 20px;
  text-align: center;
  &__text {
    margin-top: 10px;
    padding: 5px;
    color: #f00;
    font-size: 14px;
    background-color: #efefef;
  }
}

.todos {
  margin-top: 20px;
  padding: 10px;
  &__empty {
    font-size: 14px;
    text-align: center;
  }
  &__list {
    & > li {
      padding: 15px 10px;
      border-top: 1px solid #ddd;
      transition: all .3s;
      &:first-child {
        border-top: none;
      }
      &.is-completed {
        color: #ccc;
        background-color: #f3f3f3;
        .todos__completed__btn {
          text-decoration: line-through;
          color: #ccc;
          border: 2px solid #eaeaea;
          background-color: #eaeaea;
        }
        .todos__desc__title,
        .todos__desc__detail {
          color: #ccc;
        }
      }
    }
  }
  &__inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  &__completed {
    width: 15%;
    min-width: 100px;
    &__btn {
      padding: 5px 10px;
      color: #ff1919;
      font-weight: bold;
      font-size: 12px;
      border-radius: 7px;
      border: 2px solid #ff1919;
      background-color: #fff;
      transition: all .3s;
    }
  }
  &__desc {
    width: 70%;
    min-width: 450px;
    &__title {
      color: #000;
      font-weight: bold;
      font-size: 16px;
      line-height: 1.2;
      transition: all .3s;
      input {
        padding: 5px 10px;
        width: 100%;
        color: #000;
        font-size: 16px;
        border: 1px solid #ddd;
        transition: all .3s;
      }
    }
    &__detail {
      margin-top: 5px;
      color: #777;
      font-size: 14px;
      line-height: 1.2;
      transition: all .3s;
      textarea {
        padding: 5px 10px;
        width: 100%;
        color: #000;
        font-size: 14px;
        border: 1px solid #ddd;
        transition: all .3s;
      }
    }
  }
  &__btn {
    width: 10%;
    min-width: 70px;
    text-align: center;
    &__edit,
    &__delete {
      padding: 5px 10px;
      border-radius: 7px;
      color: #fff;
      font-size: 12px;
    }
    &__edit {
      background-color: #07C4D7;
    }
    &__delete {
      margin-top: 5px;
      background-color: #ff1919;
    }
  }
}

.footer {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  font-size: 14px;
  line-height: 1.2;
  color: #555;
  border-radius: 0 0 10px 10px;
  background-color: #ddd;
}
</style>
