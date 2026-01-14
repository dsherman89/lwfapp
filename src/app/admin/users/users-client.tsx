"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  username: string;
  alignment: "HEEL" | "FACE";
  isChampion: boolean;
  role: "ADMIN" | "USER";
  createdAt: string | Date;
  createdByUserId: string | null;
};

export default function AdminUsersClient(props: {
  users: Row[];
  q: string;
  page: number;
  total: number;
  totalPages: number;
  alignment: string;
  champion: string;
  admin: string;
  currentUserId: string;

  createUser: (fd: FormData) => Promise<void>;
  updateUser: (fd: FormData) => Promise<void>;
  deleteUser: (fd: FormData) => Promise<void>;
}) {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const qp = (over: Record<string, string>) => {
    const params = new URLSearchParams();
    if (props.q) params.set("q", props.q);
    if (props.alignment) params.set("alignment", props.alignment);
    if (props.champion) params.set("champion", props.champion);
    if (props.admin) params.set("admin", props.admin);
    params.set("page", over.page || String(props.page));
    return `?${params.toString()}`;
  };

  const rows = useMemo(() => props.users, [props.users]);

  return (
    <main className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">User administration</h1>
          <div className="flex gap-2">
            <a className="btn btn-secondary" href="/admin">Back to dashboard</a>
            {mode === "list" ? (
              <button className="btn btn-accent" onClick={() => setMode("create")}>
                Create new wrestler
              </button>
            ) : null}
          </div>
        </div>

        {mode === "create" ? (
          <section className="card space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Create new wrestler</div>
              <button className="btn btn-secondary" onClick={() => setMode("list")}>Cancel</button>
            </div>

            <form action={props.createUser} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" name="username" placeholder="Wrestler Name (username)" required />
              <input className="input" name="password" placeholder="Password" type="password" required />

              <fieldset className="sm:col-span-2">
                <div className="text-sm muted mb-2">Heel / Face (required)</div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="alignment" value="FACE" required />
                    Face
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="alignment" value="HEEL" required />
                    Heel
                  </label>
                </div>
              </fieldset>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isChampion" />
                Current champion?
              </label>

              <select className="input" name="role" defaultValue="USER" required>
                <option value="USER">Non admin</option>
                <option value="ADMIN">Admin</option>
              </select>

              <button className="btn btn-accent sm:col-span-2" type="submit">
                Create wrestler
              </button>
            </form>
          </section>
        ) : (
          <>
            {/* Search + filters */}
            <form className="card grid grid-cols-1 sm:grid-cols-2 gap-3" action="/admin/users" method="get">
              <input className="input" name="q" placeholder="Search by wrestler name..." defaultValue={props.q} />

              <select className="input" name="alignment" defaultValue={props.alignment}>
                <option value="">All alignments</option>
                <option value="FACE">Face</option>
                <option value="HEEL">Heel</option>
              </select>

              <select className="input" name="champion" defaultValue={props.champion}>
                <option value="">Champion (any)</option>
                <option value="yes">Champion</option>
                <option value="no">Not champion</option>
              </select>

              <select className="input" name="admin" defaultValue={props.admin}>
                <option value="">Role (any)</option>
                <option value="yes">Admin</option>
                <option value="no">Non-admin</option>
              </select>

              <button className="btn btn-accent sm:col-span-2" type="submit">Apply</button>
            </form>

            {/* Table */}
            <section className="card space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Wrestlers</div>
                <div className="text-sm muted">
                  Page {props.page} / {props.totalPages} • {props.total} total
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="muted">
                    <tr className="text-left">
                      <th className="py-2 pr-3">Name</th>
                      <th className="py-2 pr-3">Heel/Face</th>
                      <th className="py-2 pr-3">Champion</th>
                      <th className="py-2 pr-3">Admin</th>
                      <th className="py-2 pr-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((u) => {
                      const isEditing = editingId === u.id;

                      return (
                        <tr key={u.id} className="border-t border-white/10 align-top">
                          <td className="py-3 pr-3">
                            {isEditing ? (
                              <input className="input" name="username" defaultValue={u.username} form={`edit-${u.id}`} required />
                            ) : (
                              <div className="font-medium">{u.username}</div>
                            )}
                          </td>

                          <td className="py-3 pr-3">
                            {isEditing ? (
                              <select className="input" name="alignment" defaultValue={u.alignment} form={`edit-${u.id}`}>
                                <option value="FACE">Face</option>
                                <option value="HEEL">Heel</option>
                              </select>
                            ) : (
                              u.alignment
                            )}
                          </td>

                          <td className="py-3 pr-3">
                            {isEditing ? (
                              <label className="flex items-center gap-2">
                                <input type="checkbox" name="isChampion" defaultChecked={u.isChampion} form={`edit-${u.id}`} />
                                Champion
                              </label>
                            ) : (
                              u.isChampion ? "Yes" : "No"
                            )}
                          </td>

                          <td className="py-3 pr-3">
                            {isEditing ? (
                              <select className="input" name="role" defaultValue={u.role} form={`edit-${u.id}`}>
                                <option value="USER">Non-admin</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                            ) : (
                              u.role === "ADMIN" ? "Yes" : "No"
                            )}
                          </td>

                          <td className="py-3 pr-3">
                            {/* Edit form lives here so server action works */}
                            <form id={`edit-${u.id}`} action={props.updateUser} className="hidden">
                              <input type="hidden" name="id" value={u.id} />
                              <input className="input" name="password" type="password" placeholder="(unchanged)" />
                            </form>

                            <div className="flex flex-wrap gap-2">
                              {!isEditing ? (
                                <button className="btn btn-secondary" onClick={() => setEditingId(u.id)}>
                                  Edit
                                </button>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-accent"
                                    type="submit"
                                    form={`edit-${u.id}`}
                                    onClick={() => setEditingId(null)}
                                  >
                                    Save
                                  </button>
                                  <button className="btn btn-secondary" onClick={() => setEditingId(null)}>
                                    Cancel
                                  </button>
                                </>
                              )}

                              <form
                                action={props.deleteUser}
                                onSubmit={(e) => {
                                  if (u.id === props.currentUserId) {
                                    e.preventDefault();
                                    alert("You cannot delete your own account.");
                                    return;
                                  }
                                  if (!confirm("Are you sure you want to delete this user?")) e.preventDefault();
                                }}
                              >
                                <input type="hidden" name="id" value={u.id} />
                                <button className="btn btn-secondary" type="submit" className="btn btn-danger">Delete</button>
                              </form>
                            </div>

                            {isEditing ? (
                              <div className="mt-2">
                                <input
                                  className="input"
                                  name="password"
                                  type="password"
                                  placeholder="New password (optional)"
                                  form={`edit-${u.id}`}
                                />
                                <div className="text-xs muted mt-1">
                                  Leave blank to keep current password.
                                </div>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex gap-2 justify-end">
                {props.page > 1 ? <a className="btn btn-secondary" href={qp({ page: String(props.page - 1) })}>Prev</a> : null}
                {props.page < props.totalPages ? <a className="btn btn-secondary" href={qp({ page: String(props.page + 1) })}>Next</a> : null}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
