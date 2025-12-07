"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";
import { uploadProfilePicture, updateProfilePicture } from "@/lib/profiles";
import { useRouter } from "next/navigation";

type Props = {
  profilePic?: string;
  fullname: string;
  userId: string;
};

export default function UserAvatar({ profilePic, fullname, userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar!");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB!");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Upload to storage and get public URL (will delete old file if exists)
      const publicUrl = await uploadProfilePicture(
        userId,
        selectedFile,
        profilePic,
      );

      // Update profile with new picture URL
      await updateProfilePicture(userId, publicUrl);

      // Reset state and close modal
      setSelectedFile(null);
      setPreviewUrl("");
      setIsOpen(false);

      // Refresh the page to show new avatar
      router.refresh();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Gagal mengupload foto profil. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setIsOpen(false);
  };

  return (
    <div>
      {profilePic ? (
        <button onClick={() => setIsOpen(true)} className="relative group">
          <Image
            src={profilePic}
            alt="Your Profile Picture"
            width={100}
            height={100}
            className="rounded-full object-cover w-24 h-24"
          />
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="text-white" size={24} />
          </div>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary/80 text-4xl font-semibold text-secondary-foreground hover:bg-secondary transition-colors"
        >
          {fullname.charAt(0).toUpperCase()}
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Foto Profil</DialogTitle>
            <DialogDescription>
              Pilih foto profil kamu. Maksimal ukuran file 2MB.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            {previewUrl ? (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-full object-cover w-48 h-48"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {profilePic ? (
                  <Image
                    src={profilePic}
                    alt="Current Profile Picture"
                    width={200}
                    height={200}
                    className="rounded-full object-cover w-48 h-48"
                  />
                ) : (
                  <div className="flex h-48 w-48 items-center justify-center rounded-full bg-secondary/80 text-6xl font-semibold text-secondary-foreground">
                    {fullname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="mr-2" size={16} />
              Pilih Foto
            </Button>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Mengupload..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
