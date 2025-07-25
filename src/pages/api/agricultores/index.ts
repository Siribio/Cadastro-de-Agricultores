import { connectToDatabase } from "../../../lib/db";
import { Agricultor } from "../../..//models/Agricultores";
import { validaCPF } from "../../../utils/validaCPF";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const agricultores = await Agricultor.find({});
      res.status(200).json(agricultores);
    } catch (error) {
      res.status(500).json({ error: "Falha ao encontrar Agrucultores" });
    }
  } else if (req.method === "POST") {
    const {cpf} = req.body;
    if (!validaCPF(cpf)) {
      return res.status(400).json({ error: "CPF inválido" });
    try {
      const newAgricultor = new Agricultor(req.body);
      await newAgricultor.save();
      res.status(201).json(newAgricultor);
    } catch (error) {
      res.status(400).json({ error: "Falha ao cadastrar Agricultor" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}