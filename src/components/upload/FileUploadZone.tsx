import { useState, useCallback } from "react";
import { UploadIcon, FileIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number;
}

export function FileUploadZone({
  onFileSelect,
  acceptedFileTypes = ".csv",
  maxFileSize = 10,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {

    if (!file.name.endsWith(".csv")) {
      return "Please upload a CSV file";
    }


    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative border-2 border-dashed transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-muted-foreground/50",
          error && "border-destructive"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <label className="flex cursor-pointer flex-col items-center justify-center p-12">
            <UploadIcon
              className={cn(
                "size-12 mb-4 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
              weight="duotone"
            />
            <p className="text-base font-medium text-foreground mb-1">
              Drop your CSV file here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Maximum file size: {maxFileSize}MB
            </p>
            <input
              type="file"
              className="hidden"
              accept={acceptedFileTypes}
              onChange={handleFileInput}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3">
                <FileIcon className="size-6 text-primary" weight="duotone" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              type="button"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
