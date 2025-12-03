import {
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Filter,
  Search,
  Trash2,
  Edit,
} from "lucide-react";

import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/context";

export default function Links() {
  const { auth } = useContext(AuthContext);

  const [links, setLinks] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total_page: 1,
    next: "",
    prev: "",
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [editSlug, setEditSlug] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState("");

  const fetchLinks = async (page = 1) => {
    if (!auth?.token?.access_token) return;

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8008/api/v1/links/?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        setLinks(json.data || []);

        const fixUrl = (url) => {
          if (!url) return "";
          return url.startsWith("http") ? url : `http://${url}`;
        };

        setMeta({
          page: Number(json.link.page),
          limit: Number(json.link.limit),
          total_page: Number(json.link.total_page),
          next: fixUrl(json.link.next),
          prev: fixUrl(json.link.prev),
        });
      }
    } catch (err) {
      console.error("Error fetching links:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token?.access_token) {
      fetchLinks(1);
    }
  }, [auth?.token?.access_token]);

  const nextPage = () => {
    if (!meta.next) return;
    const url = new URL(meta.next);
    const page = url.searchParams.get("page");
    fetchLinks(Number(page));
  };

  const prevPage = () => {
    if (!meta.prev) return;
    const url = new URL(meta.prev);
    const page = url.searchParams.get("page");
    fetchLinks(Number(page));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (slug) => {
    setDeleteSlug(slug);
    setDeleteModal(true);
  };
  
  

  const handleEdit = (slug, url) => {
    setEditSlug(slug);
    setEditUrl(url);
    setEditModal(true);
  };

  const submitEdit = async () => {
    try {
      const res = await fetch(
        `http://localhost:8008/api/v1/links/${editSlug}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${auth.token.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: editUrl }),
        }
      );

      const json = await res.json();

      if (!json.success) {
        alert("Failed to update link");
        return;
      }

      alert("Link updated");
      setEditModal(false);
      fetchLinks(meta.page);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };
  const submitDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:8008/api/v1/links/${deleteSlug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token.access_token}`,
          },
        }
      );
  
      const json = await res.json();
  
      if (!json.success) {
        alert("Failed to delete link");
        return;
      }
  
      alert("Link deleted");
      setDeleteModal(false);
      fetchLinks(meta.page);
    } catch (err) {
      console.error(err);
      alert("Error deleting link");
    }
  };
  

  if (!auth?.token?.access_token) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen w-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-slate-600">Please login first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen w-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            Link Management
          </h1>
          <p className="text-sm text-slate-600">Manage all your short links.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Error: {error}
          </div>
        )}

       {/*  */}
        <div className="bg-white border border-slate-200 rounded-lg">
          {/* Search */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              All Status
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                    Short URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                    Visits
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : links.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-slate-600">
                      No links found
                    </td>
                  </tr>
                ) : (
                  links
                    .filter(
                      (link) =>
                        link.slug
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        link.url
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map((link) => (
                      <tr
                        key={link.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-blue-600 font-medium">
                              http://localhost:8008/{link.slug}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(`http://localhost:8008/${link.slug}`)
                              }
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700 max-w-xs truncate">
                              {link.url}
                            </span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm">{link.clicks}</td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(link.created_at).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                            active
                          </span>
                        </td>

                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(link.slug, link.url)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(link.slug)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-slate-200 flex justify-between">
            <p className="text-xs text-slate-600">
              Page {meta.page} of {meta.total_page}
            </p>

            <div className="flex gap-2">
              <button
                onClick={prevPage}
                disabled={!meta.prev}
                className="p-1.5 border border-slate-200 rounded disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextPage}
                disabled={!meta.next}
                className="p-1.5 border border-slate-200 rounded disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  modal edit */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Link</h2>

            <label className="text-sm mb-1 block">Destination URL</label>
            <input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 bg-slate-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={submitEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Delete Link</h2>

            <p className="text-sm text-slate-700 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">{deleteSlug}</span>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-slate-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={submitDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
