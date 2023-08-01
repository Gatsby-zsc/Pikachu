import { UploadDropzone } from "@/utils/uploadthing";
import { imagesAtom } from "@/components/create-event/create-event-form";
import { useAtom } from "jotai";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { X } from "lucide-react";

export function UploadImage() {
  const [images, setImages] = useAtom(imagesAtom);

  const handleClick = (imageUrl: string) => {
    setImages(images.filter((image) => image !== imageUrl));
  };

  return (
    <div>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // alert("Upload Completed");
          console.log("Files: ", res);
          if (!res) return;
          const uploadedFiles = res.map((file) => file.fileUrl);
          setImages([...images, ...uploadedFiles]);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      <div className="flex flex-wrap">
        {images.map((image) => (
          <div key={image} className="relative w-1/4 p-2">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={image}
                alt="image"
                className="rounded-md object-cover"
                fill
                sizes="25vw"
              />
            </AspectRatio>

            <div className="group absolute left-0 top-0 flex h-full w-full items-center justify-center">
              <button
                onClick={() => handleClick(image)}
                className="invisible rounded-md bg-gray-800 bg-opacity-75 p-2 text-white opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
