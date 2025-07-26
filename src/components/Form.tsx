import { useState } from 'react';

type FormProps = {
  onSuccess: () => void;
};

const validaCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf[10]);
};

export default function Form({ onSuccess }: FormProps) {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    ativo: true,
  });

  const [erro, setErro] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log

    if (!validaCPF(form.cpf)) {
      setErro('CPF inválido');
      return;
    }

    const res = await fetch('/api/agricultores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ nome: '', cpf: '', dataNascimento: '', telefone: '', ativo: true });
      onSuccess();
    } else {
      const data = await res.json();
      setErro(data.error || 'Erro ao cadastrar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white space-y-4 p-4 border rounded max-w-md">
      <h2 className="text-lg font-semibold">Cadastrar Agricultores</h2>

      {erro && <p className="text-red-600">{erro}</p>}
      <div className='flex-col m-0 space-y-2 '>
        Nome
      <input
        type="text"
        name="nome"
        placeholder="ex.: Maria da Silva"
        value={form.nome}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
  CPF
      <input
        type="text"
        name="cpf"
        placeholder="ex.: 56781912345"
        value={form.cpf}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
Data de nascimento
      <input
        type="date"
        name="dataNascimento"
        value={form.dataNascimento}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
Telefone
      <input
        type="text"
        name="telefone"
        placeholder="ex.: 11 91234-5678"
        value={form.telefone}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="ativo"
          checked={form.ativo}
          onChange={handleChange}
        />
        Ativo
      </label>
</div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Cadastrar
      </button>
    </form>
  );
}
