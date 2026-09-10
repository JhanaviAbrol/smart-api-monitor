import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/auth";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password }); 
      setSuccessMessage("Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container flex-row center-content center-items" style={{ minHeight: "80vh" }}>
      <div className="card padding-large card-shadow" style={{ width: "380px" }}>
        <h3 className="margin-bottom-medium text-center brand-name">Create an Account</h3>

        {errorMessage && <div className="alert danger-alert padding-vertical-small">{errorMessage}</div>}
        {successMessage && <div className="alert success-alert padding-vertical-small">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="margin-bottom-medium">
            <label className="form-label">Name</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="margin-bottom-medium">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="margin-bottom-medium">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="margin-bottom-medium">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="button primary-button full-width" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <hr />

        <p className="text-center margin-bottom-none">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
