import React from 'react'
import { useState } from 'react';
import { createDocument } from '../../api/Document/document';
import Input from '../../components/input/Input';
import TextField from '@mui/material/TextField';
import DefaultButton from '../../components/Button/DefaultButton';

const FormDocument = () => {
  const [reference, setReference] = useState("")
  const [objet, setObjet] = useState("")
  const [corps, setCorps] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("")
  const [pieceJointe, setPieceJointe] = useState(null)

  const [loading, setLoading] = useState(false)

  const handleCreateDocSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    const data = new FormData()
    data.append("reference", reference)
    data.append("objet", objet)
    data.append("corps", corps)
    data.append("type", type)
    data.append("status", status)
    data.append("pieceJointe", pieceJointe)

    try {
      const response = await createDocument(data)
      console.log("Creation réussi : ", response)
    } catch (err) {
      console.warn("Erreur lors de la création de document: ", err.message)
    }
    
  }

  return (
    <form onSubmit={handleCreateDocSubmit} className="mx-auto w-full">
      <div className="mb-7">
        <h2 className="font-eirene text-xl">Veuillez vous inscrire</h2>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-dropline">
        <div className="flex flex-col">
            <label htmlFor="reference" className="mb-1 text-sm text-gray-700">Reference</label>
            <Input
                id="reference"
                label="Reference"
                placeholder="Entrez le reference"
                required={true}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
            />
        </div>
        <div className="flex flex-col">
            <label htmlFor="objet" className="mb-1 text-sm text-gray-700">Objet</label>
            <Input
                id="objet"
                label="Objet"
                placeholder="Entrez l'objet du document"
                required={false}
                value={objet}
                onChange={(e) => setObjet(e.target.value)}
            />
        </div>
        <div className="flex flex-col">
            <label htmlFor="corps" className="mb-1 text-sm text-gray-700">Corps</label>
            <Input
                id="corps"
                label="Corps"
                placeholder="Entrez le corps du document"
                required={false}
                value={corps}
                onChange={(e) => setCorps(e.target.value)}
            />
        </div>
        <div className="flex flex-col">
            <label htmlFor="type" className="mb-1 text-sm text-gray-700">Type</label>
            <Input
                id="type"
                label="Type"
                placeholder="Entrez le type du document"
                required={true}
                value={type}
                onChange={(e) => setType(e.target.value)}
            />
        </div>
        <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 text-sm text-gray-700">Status</label>
            <Input
                id="status"
                label="Status"
                placeholder="Entrez le status du document"
                required={true}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            />
        </div>

        <div className="flex flex-col">
            <TextField
              type="file"
              required
              fullWidth
              label="Pièce jointe"
              onChange={(e) => setPieceJointe(e.target.files[0])}
              sx = {{ width: "300px" }}
              slotProps={{
                htmlInput: { accept: "*" }, // 👈 équivalent de accept="*"
                inputLabel: { shrink: true } // 👈 pour garder le label visible
              }}
            />
        </div> 
      </div>
      <div className="flex items-center col-span-1 mx-6 mt-12  lg:justify-center lg:col-span-2">
          <DefaultButton
              bgColor="var(--color-accent)"
              label={loading ? "Création..." : "Creer"}
              type="submit"
              disabled={loading}
          />
      </div>
    </form>
  )
}

export default FormDocument