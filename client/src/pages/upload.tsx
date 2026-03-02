import { useState } from "react";
import { useLocation } from "wouter";
import { useUploadCall } from "@/hooks/use-calls";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  UploadCloud, 
  FileAudio, 
  CheckCircle2, 
  Loader2, 
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Upload() {
  const [, setLocation] = useLocation();
  const { mutate: uploadCall, isPending, error } = useUploadCall();
  
  const [salespersonName, setSalespersonName] = useState("");
  const [clientName, setClientName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !salespersonName || !clientName) return;

    const formData = new FormData();
    formData.append("salespersonName", salespersonName);
    formData.append("clientName", clientName);
    formData.append("audio", file);

    uploadCall(formData, {
      onSuccess: (data) => {
        // Redirect to the new call report
        setLocation(`/calls/${data.id}`);
      }
    });
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto w-full h-full flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-10 w-full">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          Analyze New Call
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
          Upload a sales call recording and our AI will transcribe, analyze sentiment, and extract actionable insights instantly.
        </p>
      </div>

      <Card className="w-full max-w-2xl p-8 rounded-3xl shadow-xl shadow-black/5 border-border/60 bg-card/80 backdrop-blur-xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {isPending ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Analyzing Audio</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Our AI is transcribing the conversation, scoring performance, and extracting insights. This might take a minute...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-600">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error.message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salesperson" className="text-sm font-semibold text-foreground">Salesperson Name</Label>
                  <Input 
                    id="salesperson" 
                    placeholder="e.g. John Doe" 
                    className="h-12 px-4 rounded-xl bg-background border-border focus-visible:ring-primary/20 transition-all"
                    value={salespersonName}
                    onChange={(e) => setSalespersonName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-sm font-semibold text-foreground">Client Name</Label>
                  <Input 
                    id="client" 
                    placeholder="e.g. Acme Corp" 
                    className="h-12 px-4 rounded-xl bg-background border-border focus-visible:ring-primary/20 transition-all"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Call Recording (Audio)</Label>
                <div 
                  className={`
                    relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ease-out text-center cursor-pointer
                    ${isDragging ? "border-primary bg-primary/5" : file ? "border-emerald-500/50 bg-emerald-500/5" : "border-border hover:border-primary/50 hover:bg-secondary/50"}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("audio-upload")?.click()}
                >
                  <input 
                    id="audio-upload" 
                    type="file" 
                    accept="audio/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <p className="text-xs text-primary mt-2 font-medium hover:underline">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-2">
                        <UploadCloud className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <p className="text-base font-semibold text-foreground">Click to upload or drag & drop</p>
                      <p className="text-sm text-muted-foreground">MP3, WAV, or M4A (Max 25MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || !salespersonName || !clientName}
                className="
                  w-full h-14 rounded-xl font-bold text-lg
                  bg-gradient-to-r from-primary to-primary/90 
                  text-primary-foreground shadow-lg shadow-primary/25
                  hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-md
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  transition-all duration-200 ease-out flex items-center justify-center gap-2
                "
              >
                <FileAudio className="w-5 h-5" />
                Analyze Call
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
