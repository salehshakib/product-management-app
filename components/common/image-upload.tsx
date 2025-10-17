"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onChange: (value: string) => void;
  onUploadComplete?: (result: any) => void;
  disabled?: boolean;
}

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onUploadComplete,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (result: any) => {
    console.log("Upload success:", result);
    onChange(result?.info?.secure_url);
    onUploadComplete?.(result?.info);
    setIsUploading(false);
  };

  const handleUploadError = (error: any) => {
    console.error("Upload error:", error);
    setIsUploading(false);
  };

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      options={{
        multiple: false,
        resourceType: "image",
        maxImageWidth: 2000,
        maxImageHeight: 2000,
        maxFileSize: 10000000, // 10MB for image
        clientAllowedFormats: ["png", "jpg", "jpeg", "gif", "webp"],
        sources: ["local", "url"],
        cropping: true,
        croppingAspectRatio: 1,
        croppingValidateDimensions: true,
        showAdvancedOptions: false,
        defaultSource: "local",
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
        },
      }}
      onSuccess={handleUploadSuccess}
      onError={handleUploadError}
      onOpen={() => {
        console.log("Cloudinary widget opened successfully");
        setIsUploading(true);
      }}
      onClose={() => {
        console.log("Cloudinary widget closed");
        setIsUploading(false);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => {
            console.log("Upload button clicked, opening widget...");
            open();
          }}
          disabled={disabled || isUploading}
          className="size-32 bg-white dark:bg-black rounded-md border-2 border-dashed border-muted-foreground/50 hover:border-muted-foreground hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className=" text-muted-foreground font-medium">
            {isUploading ? "Uploading..." : "Upload Image"}
          </span>
        </button>
      )}
    </CldUploadWidget>
  );
};
