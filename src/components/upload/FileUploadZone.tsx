import { useState, useCallback } from "react";
import { CloudArrowUp, File, X, Sparkle } from "@phosphor-icons/react";
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
    []
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
          "relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01] shadow-glow-sm"
            : "border-border/60 bg-card/80 hover:border-primary/50 hover:bg-card",
          error && "border-destructive/50 bg-destructive/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                               linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />
        </div>

        {!selectedFile ? (
          <label className="relative flex cursor-pointer flex-col items-center justify-center p-12 sm:p-16">
            {/* Icon container with glow */}
            <div
              className="relative mb-6"
              style={{
                transform: isDragging ? 'scale(1.1) translateY(-5px)' : 'scale(1) translateY(0)',
                transition: 'transform 0.2s'
              }}
            >
                <div className={cn(
                  "absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300",
                  isDragging ? "bg-primary/30 opacity-100" : "bg-primary/10 opacity-0"
                )} />
                <div className={cn(
                  "relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isDragging 
                    ? "bg-primary/20 border-primary/50" 
                    : "bg-muted/50 border-border/50",
                  "border backdrop-blur-sm"
                )}>
                  <CloudArrowUp
                    size={40}
                    weight="duotone"
                    className={cn(
                      "transition-colors duration-300",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
            </div>

            <div 
              className="text-center"
              style={{
                transform: isDragging ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'transform 0.2s'
              }}
            >
                <p className="text-lg font-semibold text-foreground mb-2">
                  {isDragging ? "Release to upload" : "Drop your CSV file here"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse your files
                </p>
                
                {/* File info badges */}
                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground/70">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 border border-border/30">
                    <File size={12} weight="duotone" />
                    CSV format
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 border border-border/30">
                    <Sparkle size={12} weight="duotone" />
                    Max {maxFileSize}MB
                  </span>
                </div>
            </div>

            <input
              type="file"
              className="hidden"
              accept={acceptedFileTypes}
              onChange={handleFileInput}
            />
          </label>
        ) : (
          <div className="relative flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                {/* File icon with success state */}
                <div className="relative">
                  <div className="absolute inset-0 bg-income/20 rounded-xl blur-lg" />
                  <div className="relative w-14 h-14 rounded-xl bg-income/10 border border-income/30 flex items-center justify-center">
                    <File size={28} weight="duotone" className="text-income" />
                  </div>
                </div>
                
                <div>
                  <p className="font-semibold text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                type="button"
                className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X size={18} weight="bold" />
                <span className="sr-only">Remove file</span>
              </Button>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-3 text-sm text-destructive flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </div>
  );
}
