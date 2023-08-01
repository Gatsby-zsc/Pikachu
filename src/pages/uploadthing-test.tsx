import { UploadDropzone } from "@/utils/uploadthing";
import { useEffect, useState } from "react";

export default function UploadthingTest() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    console.log("status: ", files);
  }, [files]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // alert("Upload Completed");
          console.log("Files: ", res);
          if (!res) return;
          const uploadedFiles = res.map((file) => file.fileUrl);
          setFiles({
            ...files,
            ...uploadedFiles,
          });
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
