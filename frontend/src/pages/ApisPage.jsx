import { useEffect, useState } from "react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

function ApisPage() {
  const [apis, setApis] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  // Form fields for adding a new API
  const [newApiName, setNewApiName] = useState("");
  const [newApiUrl, setNewApiUrl] = useState("");
  useEffect(() => {
    loadApis();
  }, []);

  async function loadApis() {
    setLoading(true);
    try {
      const response = await api.get("/apis");
      setApis(response.data);
    } catch (err) {
      console.error("Failed to load APIs:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredApis = apis.filter((a) =>
    a.name.toLowerCase().includes(searchText.toLowerCase())
  );

  async function handleAddApi(event) {
    event.preventDefault();

    if (newApiName.trim() === "" || newApiUrl.trim() === "") {
      return;
    }

    try {
      await api.post("/apis", { name: newApiName, url: newApiUrl });
      setNewApiName("");
      setNewApiUrl("");
      loadApis(); 
    } catch (err) {
      console.error("Failed to add API:", err);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/apis/${id}`);
      loadApis();
    } catch (err) {
      console.error("Failed to delete API:", err);
    }
  }

  return (
    <div className="page-container padding-vertical-large">
      <h2 className="margin-bottom-large">API Management</h2>

      <div className="card padding-medium margin-bottom-large">
        <h5>Add a new API</h5>
        <form onSubmit={handleAddApi} className="content-row small-grid-gap end-items">
          <div className="stat-column">
            <label className="form-label">API Name</label>
            <input
              type="text"
              className="form-input"
              value={newApiName}
              onChange={(e) => setNewApiName(e.target.value)}
              placeholder="e.g. Billing API"
            />
          </div>
          <div className="five-column">
            <label className="form-label">URL</label>
            <input
              type="text"
              className="form-input"
              value={newApiUrl}
              onChange={(e) => setNewApiUrl(e.target.value)}
              placeholder="https://api.example.com/..."
            />
          </div>
          <div className="third-column">
            <button type="submit" className="button primary-button full-width">
              Add API
            </button>
          </div>
        </form>
      </div>

      <input
        type="text"
        className="form-input margin-bottom-medium"
        placeholder="Search APIs by name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div className="card padding-medium">
        {loading ? (
          <p className="muted-text margin-bottom-none">Loading...</p>
        ) : (
          <data-table className="data-table hover-table margin-bottom-none">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Status</th>
                <th>Response Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredApis.map((apiItem) => (
                <tr key={apiItem.id}>
                  <td>{apiItem.name}</td>
                  <td className="muted-text">{apiItem.url}</td>
                  <td>
                    <StatusBadge status={apiItem.status} />
                  </td>
                  <td>{apiItem.responseTime} ms</td>
                  <td>
                    <button
                      className="button outline-secondary-button small-button"
                      onClick={() => handleDelete(apiItem.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredApis.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center muted-text padding-vertical-medium">
                    No APIs found.
                  </td>
                </tr>
              )}
            </tbody>
          </data-table>
        )}
      </div>
    </div>
  );
}

export default ApisPage;
