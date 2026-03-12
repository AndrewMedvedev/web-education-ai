const inputField = (props) => {
  const { label, type, className } = props;

  return (
    <div className={className}>
      <label>{label}</label>
      <input type={type}></input>
    </div>
  );
};

export default inputField;
