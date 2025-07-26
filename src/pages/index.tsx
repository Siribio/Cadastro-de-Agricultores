import react, { useEffect, useState } from "react";
import Form from "@/components/Form";
import EditModal from "@/components/EditModal";

type Agricultor = {
  _id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  ativo: boolean;
};

export default function ListaAgricultores() {
  const [Agricultores, setAgricultores] = useState<Agricultor[]>([]); //lista de agricultores
  const [modalOpen, setModalOpen] = useState(false); // controle do modal de edição
  const [selected, setSelected] = useState(null); // agricultor selecionado para edição
  const [sortBy, setSortBy] = useState<
    "nome_asc" | "nome_desc" | "nasc_asc" | "nasc_desc" | ""
  >(""); // controle de ordenação
  const [ativoFilter, setAtivoFilter] = useState<"" | "ativo" | "inativo">(""); // controle de filtro de ativo/inativo

  useEffect(() => {
    async function carregarDados() {
      const res = await fetch("/api/agricultores");
      const data = await res.json();
      setAgricultores(data);
    }

    carregarDados();
  }, []);

  useEffect(() => {
    fetch("/api/agricultores")
      .then((res) => res.json())
      .then((data) => setAgricultores(data));
  }, []);

  const filtrarAgricultores = () => {
    let filtrados = [...Agricultores];

    if (ativoFilter === "ativo") {
      filtrados = filtrados.filter((a) => a.ativo);
    } else if (ativoFilter === "inativo") {
      filtrados = filtrados.filter((a) => !a.ativo);
    }

    switch (sortBy) {
      case "nome_asc":
        filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case "nome_desc":
        filtrados.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case "nasc_asc":
        filtrados.sort(
          (a, b) =>
            new Date(a.dataNascimento).getTime() -
            new Date(b.dataNascimento).getTime()
        );
        break;
      case "nasc_desc":
        filtrados.sort(
          (a, b) =>
            new Date(b.dataNascimento).getTime() -
            new Date(a.dataNascimento).getTime()
        );
        break;
    }

    return filtrados;
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/agricultores/${id}`, { method: "DELETE" });
    setAgricultores((prev) => prev.filter((p) => p._id !== id));
  };

  const handleEdit = (agricultor) => {
    setSelected(agricultor);
    setModalOpen(true);
  };

  return (
    <div className="flex text-center justify-center  min-h-screen">
      <div className="p-4 ">
        <div className="flex justify-center">
          <Form
            onSuccess={() => {
              fetch("/api/agricultores")
                .then((res) => res.json())
                .then((data) => setAgricultores(data));
            }}
          />
        </div>
        <h1 className="text-xl font-bold my-4">LIsta de Agricultores</h1>

        <div className="flex gap-4 mb-4 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border p-1 rounded"
          >
            <option value="">Ordenar por...</option>
            <option value="nome_asc">Nome A-Z</option>
            <option value="nome_desc">Nome Z-A</option>
            <option value="nasc_asc">Nascimento ↑</option>
            <option value="nasc_desc">Nascimento ↓</option>
          </select>

          <select
            value={ativoFilter}
            onChange={(e) => setAtivoFilter(e.target.value as any)}
            className="border p-1 rounded"
          >
            <option value="">Todos</option>
            <option value="ativo">Apenas Ativos</option>
            <option value="inativo">Apenas Inativos</option>
          </select>
        </div>

        <table className=" border min-w-[768px] max-w-[1024px] mx-auto">
          <thead>
            <tr className="bg-green-50">
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">CPF</th>
              <th className="p-2 border">Nascimento</th>
              <th className="p-2 border">Telefone</th>
              <th className="p-2 border">Ativo</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrarAgricultores().map((p) => (
              <tr key={p._id}>
                <td className="p-2 border">{p.nome}</td>
                <td className="p-2 border">{p.cpf}</td>
                <td className="p-2 border">
                  {new Date(p.dataNascimento).toLocaleDateString()}
                </td>
                <td className="p-2 border">{p.telefone}</td>
                <td className="p-2 border">{p.ativo ? "Sim" : "Não"}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={p.ativo}
                    title={p.ativo ? "Desative antes de excluir" : ""}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <EditModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          agricultor={selected}
          onSave={async (updated) => {
            await fetch(`/api/agricultores/${updated._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updated),
            });
            const res = await fetch("/api/agricultores");
            const data = await res.json();
            setAgricultores(data);
          }}
        />
      </div>
    </div>
  );
}
