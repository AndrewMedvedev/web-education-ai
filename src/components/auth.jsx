import "../styles/auth.css";

const Auth = () => {
  return (
    <div className="auth-container">
      <div className="header">
        <h1>Войдите в учетную запись</h1>
      </div>
      <form className="form">
        <div className="login">
          <label>Логин</label>
          <input type="text"></input>
        </div>
        <div className="password">
          <label>Пароль</label>
          <input type="password"></input>
        </div>
        <button>Войти</button>
      </form>
    </div>
  );
};

export default Auth;
