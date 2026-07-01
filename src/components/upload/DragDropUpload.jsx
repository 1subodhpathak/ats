import { useRef, useState } from "react";
import { FileUp, UploadCloud } from "lucide-react";

import Button from "../common/Button";

function DragDropUpload({ onFileSelected, disabled = false }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const [file] = files || [];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div
      className={[
        "rounded-[28px] border-2 border-dashed p-8 text-center transition",
        isDragging
          ? "border-sky-500 bg-sky-50"
          : "border-slate-200 bg-white/70",
        disabled ? "pointer-events-none opacity-60" : "",
      ].join(" ")}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
        <UploadCloud className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-900">
        Drag and drop your resume
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        Upload PDF, DOC, or DOCX files up to 10 MB. The backend will extract text
        and structure the resume into editable sections.
      </p>
      <div className="mt-6">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <Button
          className="gap-2"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <FileUp className="h-4 w-4" />
          Choose file
        </Button>
      </div>
    </div>
  );
}

export default DragDropUpload;
