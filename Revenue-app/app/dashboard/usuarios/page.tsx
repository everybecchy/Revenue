"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, User } from "@/lib/api";
import useSWR, { mutate } from "swr";
import { Search, Plus, Edit, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import EditAffiliateModal from "@/components/edit-affiliate-modal";

export default function UsuariosPage() {
  const { token, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states for new user
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newInstagram, setNewInstagram] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: users, isLoading } = useSWR<User[]>(
    token && isAdmin ? "/api/users" : null,
    (url: string) => api<User[]>(url, { token })
  );
  const filteredUsers = users?.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.instagram?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api("/api/users", {
        method: "POST",
        token,
        body: {
          email: newEmail,
          name: newName || null,
          instagram: newInstagram || null,
          password: newPassword,
        },
      });

      mutate("/api/users");
      setNewEmail("");
      setNewName("");
      setNewInstagram("");
      setNewPassword("");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      await api(`/api/users/${userId}`, {
        method: "DELETE",
        token,
      });
      mutate("/api/users");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir usuário");
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4">
          Acesso negado. Somente administradores podem acessar esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerenciamento de afiliados cadastrados
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Form - Novo Afiliado */}
        <div className="bg-card border border-border rounded-xl p-4 lg:p-5 shadow-sm lg:col-span-1 h-fit order-2 lg:order-1">
          <h3 className="text-base lg:text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
            Novo Afiliado
          </h3>
          <form onSubmit={handleAddUser} className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                E-mail *
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="afiliado@email.com"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Nome
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome do afiliado"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Instagram
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={newInstagram}
                  onChange={(e) => setNewInstagram(e.target.value)}
                  placeholder="usuario"
                  className="flex-1 w-full rounded-r-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Senha de Acesso *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-secondary text-slate-800 font-medium py-2.5 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Cadastrar Afiliado
                </>
              )}
            </button>
          </form>
        </div>

        {/* Table - Afiliados Cadastrados */}
        <div className="bg-card border border-border rounded-xl shadow-sm lg:col-span-2 flex flex-col order-1 lg:order-2">
          <div className="p-4 lg:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/50 gap-3 rounded-t-xl">
            <h3 className="text-base lg:text-lg font-bold text-foreground">
              Afiliados Cadastrados
            </h3>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar afiliado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 text-muted-foreground h-4 w-4" />
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block lg:hidden p-4 space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredUsers?.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhum afiliado encontrado
              </p>
            ) : (
              filteredUsers?.map((user) => (
                <div
                  key={user.id}
                  className="bg-muted/50 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {user.name || "-"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-success/10 text-success"
                          : user.status === "blocked"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {user.status === "active"
                        ? "Ativo"
                        : user.status === "blocked"
                        ? "Bloqueado"
                        : "Inativo"}
                    </span>
                  </div>
                  {user.instagram && (
                    <p className="text-sm text-muted-foreground">
                      @{user.instagram}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-sm">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Excluir</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Usuário
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Instagram
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : filteredUsers?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Nenhum afiliado encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsers?.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-card border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name || "-"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {user.instagram ? `@${user.instagram}` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-success/10 text-success"
                              : user.status === "blocked"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {user.status === "active"
                            ? "Ativo"
                            : user.status === "blocked"
                            ? "Bloqueado"
                            : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Affiliate Modal */}
      {editingUser && (
        <EditAffiliateModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
