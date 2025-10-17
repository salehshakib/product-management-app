"use client";

import { createContext, useContext, useRef, ReactNode } from "react";
import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryContextValue {
  openWidget: (onSuccess: (url: string) => void) => void;
}

const CloudinaryContext = createContext<CloudinaryContextValue | null>(null);

export const useCloudinary = () => {
  const context = useContext(CloudinaryContext);
  if (!context) {
    throw new Error("useCloudinary must be used within CloudinaryProvider");
  }
  return context;
};

interface CloudinaryProviderProps {
  children: ReactNode;
}

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function CloudinaryProvider({ children }: CloudinaryProviderProps) {
  const widgetRef = useRef<any>(null);
  const onSuccessCallbackRef = useRef<((url: string) => void) | null>(null);

  const openWidget = (onSuccess: (url: string) => void) => {
    onSuccessCallbackRef.current = onSuccess;
    if (widgetRef.current) {
      widgetRef.current();
    }
  };

  const handleUploadSuccess = (result: any) => {
    const url = result?.info?.secure_url;
    if (url && onSuccessCallbackRef.current) {
      onSuccessCallbackRef.current(url);
      onSuccessCallbackRef.current = null;
    }
  };

  return (
    <CloudinaryContext.Provider value={{ openWidget }}>
      {children}

      {/* Render Cloudinary widget at top level, outside any modals */}
      <CldUploadWidget
        uploadPreset={uploadPreset}
        options={{
          multiple: false,
          resourceType: "image",
          maxImageWidth: 2000,
          maxImageHeight: 2000,
          maxFileSize: 10000000,
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
        onError={(error) => console.error("Upload error:", error)}
      >
        {({ open }) => {
          widgetRef.current = open;
          return null;
        }}
      </CldUploadWidget>
    </CloudinaryContext.Provider>
  );
}
