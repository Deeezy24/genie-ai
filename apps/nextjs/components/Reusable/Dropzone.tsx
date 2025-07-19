import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileType } from "@/lib/types";

type DropzoneComponentProps = {
  value?: File;
  onChange?: (file: File | null) => void;
  type?: FileType;
};

const DropzoneComponent = ({ onChange, value, type = "file" }: DropzoneComponentProps) => {
  const [fileObj, setFileObj] = useState<{
    file: File;
    id: string;
    status: string;
    progress: number;
  } | null>(null);

  useEffect(() => {
    if (value && !fileObj) {
      setFileObj({
        file: value,
        id: Math.random().toString(36).substr(2, 9),
        status: "completed",
        progress: 100,
      });
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const newFile = {
          file,
          id: Math.random().toString(36).substr(2, 9),
          status: "pending",
          progress: 0,
        };
        setFileObj(newFile);
        onChange?.(file);
        simulateUpload(newFile);
      }

      if (rejectedFiles.length > 0) {
        console.log("Rejected files:", rejectedFiles);
      }
    },
    [onChange],
  );

  const simulateUpload = (fileObj: { file: File; id: string; status: string; progress: number }) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        clearInterval(interval);
        setFileObj((prev) => (prev?.id === fileObj.id ? { ...prev, status: "completed", progress: 100 } : prev));
      } else {
        setFileObj((prev) => (prev?.id === fileObj.id ? { ...prev, progress } : prev));
      }
    }, 200);
  };

  const removeFile = () => {
    setFileObj(null);
    onChange?.(null);
  };

  const getAcceptTypes = (type: FileType) => {
    if (type === "audio") {
      return {
        "audio/*": [".mp3", ".m4a", ".wav", ".ogg", ".flac"],
      };
    }
    if (type === "image") {
      return {
        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      };
    }

    // Default for "file"
    return {
      "application/pdf": [".pdf"],
      "text/*": [".txt", ".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    };
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => onDrop(acceptedFiles, fileRejections as any),
    accept: getAcceptTypes(type) as any,
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType === "application/pdf") return "📄";
    if (fileType === "audio/mpeg") return "🎤";
    if (fileType.startsWith("text/")) return "📝";
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return "📊";
    return "📁";
  };

  const getFileTypeBadge = (fileType: string) => {
    if (fileType.startsWith("image/")) return { text: "Image", variant: "default" };
    if (fileType === "application/pdf") return { text: "PDF", variant: "destructive" };
    if (fileType === "audio/mpeg") return { text: "Audio", variant: "secondary" };
    if (fileType.startsWith("text/")) return { text: "Text", variant: "secondary" };
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return { text: "Excel", variant: "outline" };
    return { text: "File", variant: "secondary" };
  };

  return (
    <Card className="dark:bg-transparent shadow-none">
      <CardHeader className="hidden">
        <CardTitle className="text-center">File Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dropzone Area */}
        <div
          {...getRootProps()}
          className={`
            relative border-2 h-96 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive && !isDragReject ? "border-primary bg-primary/5" : ""}
            ${isDragReject ? "border-destructive bg-destructive/5" : ""}
            ${!isDragActive ? "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Upload className={`w-12 h-12 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
            {isDragActive ? (
              <div className="text-primary">
                {isDragReject ? (
                  <p className="text-destructive">Some files are not accepted</p>
                ) : (
                  <p>Drop file here...</p>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">Drop a file here or click to browse</p>
                <p className="text-sm mt-1">
                  Supports:
                  {type === "audio"
                    ? ".mp3, .m4a, .wav, .ogg, .flac"
                    : type === "image"
                      ? ".png, .jpg, .jpeg, .gif"
                      : "PDF, Text, Excel"}
                  (Max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* File Preview */}
        {fileObj && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Uploaded File</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-destructive hover:text-destructive"
              >
                Clear
              </Button>
            </div>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-2xl">{getFileIcon(fileObj.file.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                      <Badge variant={getFileTypeBadge(fileObj.file.type).variant as any} className="text-xs">
                        {getFileTypeBadge(fileObj.file.type).text}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatFileSize(fileObj.file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {fileObj.status === "completed" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {fileObj.status === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DropzoneComponent;
