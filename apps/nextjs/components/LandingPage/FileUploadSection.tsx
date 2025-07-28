"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Upload } from "lucide-react";
import { useState } from "react";
import AuthModal from "../Reusable/AuthModal";

const FileUploadSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleFile = (file: File) => {
    if (file.type === "application/pdf" || file.type.includes("document")) {
      setShowAuthModal(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) handleFile(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) handleFile(files[0]);
  };

  const triggerFileInput = () => document.getElementById("file-input")?.click();

  const closeAuthModal = () => {
    setShowAuthModal(false);
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <section id="upload" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Upload Your CV</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Drag and drop your CV or click to browse. We support PDF, DOC, and DOCX files.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
          <CardContent className="p-8">
            <label
              htmlFor="file-input"
              className="text-center w-full block cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload your CV</h3>
              <p className="text-muted-foreground mb-6">Drag and drop your CV file here, or click to browse</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={triggerFileInput}>Choose File</Button>
                <Button variant="outline" onClick={triggerFileInput}>
                  Browse Files
                </Button>
              </div>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground mt-4">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
            </label>
          </CardContent>
        </Card>
      </div>
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        title="Sign in to Upload Your CV"
        description="Create an account or sign in to start analyzing your CV with AI-powered insights."
        onCancel={closeAuthModal}
      />
    </section>
  );
};

export default FileUploadSection;
