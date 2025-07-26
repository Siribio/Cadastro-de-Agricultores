import { connectToDatabase } from "../../../lib/db";
import { Agricultor } from "../../../models/Agricultor";

export default async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const agricultor = await Agricultor.findById(id);
      if (!agricultor) {
        return res.status(404).json({ error: "Agricultor não encontrado" });
      }
      res.status(200).json(agricultor);
    } catch (error) {
      res.status(500).json({ error: "Falha ao encontrar Agricultor" });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedAgricultor = await Agricultor.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedAgricultor) {
        return res.status(404).json({ error: "Agricultor não encontrado" });
      }
      res.status(200).json(updatedAgricultor);
    } catch (error) {
      res.status(400).json({ error: "Falha ao atualizar Agricultor" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedAgricultor = await Agricultor.findByIdAndDelete(id);
      if (!deletedAgricultor) {
        return res.status(404).json({ error: "Agricultor não encontrado" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Falha ao deletar Agricultor" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}