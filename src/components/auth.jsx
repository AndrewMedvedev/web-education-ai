import "../styles/auth.css";

const Auth = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Войдите в учетную запись</h1>
      </div>
      <form className="form">
        <div className="login">
          <label>Логин</label>
          <input></input>
        </div>
        <div className="password">
          <label>Пароль</label>
          <input></input>
        </div>
        <button>Войти</button>
      </form>
    </div>
  );
};

export default Auth;
