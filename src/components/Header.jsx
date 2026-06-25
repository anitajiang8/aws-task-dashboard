function Header() {
  return (
    <div className="header">
      <p className="eyebrow">AWS Serverless Project</p>
      <h1>Task Dashboard</h1>
      <p className="subtitle">
        A frontend task manager that will later connect to API Gateway, Lambda,
        and DynamoDB.
      </p>
    </div>
  );
}

export default Header;