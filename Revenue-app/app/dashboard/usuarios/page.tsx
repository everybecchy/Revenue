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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
      await api("/api/users", {
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
      setIsAddModalOpen(false);
      setNewEmail("");
      setNewName("");
      setNewInstagram("");
      setNewPassword("");
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
        <div className="bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 text-[var(--color-destructive)] rounded-lg p-4">
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
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">Usuários</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Gerenciamento de afiliados cadastrados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Form - Novo Afiliado */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4 sm:p-5 shadow-sm lg:col-span-1 h-fit">
          <h3 className="text-base sm:text-lg font-bold text-[var(--color-foreground)] mb-4 border-b border-[var(--color-border)] pb-2">
            Novo Afiliado
          </h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                E-mail *
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="afiliado@email.com"
                className="w-full rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Nome
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome do afiliado"
                className="w-full rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Instagram
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[var(--color-input)] bg-[var(--color-muted)] text-[var(--color-muted-foreground)] text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={newInstagram}
                  onChange={(e) => setNewInstagram(e.target.value)}
                  placeholder="usuario"
                  className="flex-1 w-full rounded-r-lg border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1">
                Senha de Acesso *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
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
              <div className="bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 text-[var(--color-destructive)] rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-medium py-2.5 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
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
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-sm lg:col-span-2 flex flex-col overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--color-muted)]/50 gap-4">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-foreground)]">
              Afiliados Cadastrados
            </h3>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar afiliado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <Search className="absolute left-3 top-2.5 text-[var(--color-muted-foreground)] h-4 w-4" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[500px]">
              <thead className="text-xs text-[var(--color-muted-foreground)] uppercase bg-[var(--color-muted)]/30 border-b border-[var(--color-border)]">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3">
                    Usuário
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3">
                    Instagram
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 sm:px-6 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-[var(--color-primary)]" />
                    </td>
                  </tr>
                ) : filteredUsers?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 sm:px-6 py-8 text-center text-[var(--color-muted-foreground)]"
                    >
                      Nenhum afiliado encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsers?.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-[var(--color-card)] border-b border-[var(--color-border)] hover:bg-[var(--color-muted)]/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <p className="font-medium text-[var(--color-foreground)]">
                            {user.name || "-"}
                          </p>
                          <p className="text-[var(--color-muted-foreground)] text-xs">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-[var(--color-muted-foreground)]">
                        {user.instagram ? `@${user.instagram}` : "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                              : user.status === "blocked"
                              ? "bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]"
                              : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                          }`}
                        >
                          {user.status === "active"
                            ? "Ativo"
                            : user.status === "blocked"
                            ? "Bloqueado"
                            : "Inativo"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 rounded-lg hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-lg hover:bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] transition-colors"
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
