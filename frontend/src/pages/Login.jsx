import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await loginUser({ email, password }); 
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container flex-row center-content center-items" style={{ minHeight: "80vh" }}>
      <div className="card padding-large card-shadow" style={{ width: "380px" }}>
        <h3 className="margin-bottom-medium text-center brand-name">MonitorIQ Login</h3>

        {errorMessage && <div className="alert danger-alert padding-vertical-small">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="margin-bottom-medium">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="margin-bottom-medium">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button primary-button full-width margin-bottom-small" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <hr />

        <p className="text-center margin-bottom-none">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div> 
  );
}

export default Login;
