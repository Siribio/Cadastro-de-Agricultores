import mongoose from 'mongoose';

const AgricultorSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  cpf: {type: String, required: true, unique: true},
  dataNascimento: {type: Date, required: true},
  telefone: {type: String, required: true},
});

export const Agricultor = mongoose.models.Agricultor || mongoose.model('Agricultor', AgricultorSchema);