import React, { useEffect, useState } from "react";

type Agricultor = {
  _id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  ativo: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  agricultor: Agricultor | null;
  onSave: (agricultor: Agricultor) => void;
};

export default function EditModal({ isOpen, onClose, agricultor, onSave }: Props) {
  const [formData, setFormData] = useState<Agricultor | null>(null);

  useEffect(() => {
    if (agricultor) {
      setFormData({ ...agricultor });
    }
  }, [agricultor]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData!);
    onClose();
  };

  return (
    <div className="flex fixed inset-0 bg-[#0009] items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Agricultor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="CPF"
            className="border p-2 w-full"
            required
          />
          <input
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento?.substring(0, 10)}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            className="border p-2 w-full"
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
            />
            <span>Ativo</span>
          </label>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
