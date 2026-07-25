import { useRef, useState, type ChangeEvent } from 'react';

interface SelfieUploadProps {
  onSearch: (file: File) => Promise<void>;
  loading: boolean;
}

export function SelfieUpload({ onSearch, loading }: SelfieUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!selectedFile) return;
    await onSearch(selectedFile);
  }

  return (
    <div className="selfie-upload">
      <p className="selfie-upload__hint">Envie uma selfie para encontrar suas fotos neste evento.</p>

      {preview && <img className="selfie-upload__preview" src={preview} alt="Prévia da selfie" />}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        hidden
      />

      <div className="selfie-upload__actions">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={loading}>
          {preview ? 'Trocar foto' : 'Selecionar selfie'}
        </button>
        <button type="button" onClick={handleSubmit} disabled={!selectedFile || loading}>
          {loading ? 'Buscando...' : 'Buscar minhas fotos'}
        </button>
      </div>
    </div>
  );
}
