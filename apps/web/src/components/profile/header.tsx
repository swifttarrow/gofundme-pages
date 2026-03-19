"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { SeedUser, formatCents } from "@/lib/seed-data";
import { Badges, MOCK_BADGES } from "@/components/badges";
import { updateProfile } from "@/lib/api";

const DEFAULT_BACKSPLASH_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop";

interface ProfileHeaderProps {
  user: SeedUser;
  isOwnProfile?: boolean;
}

interface EditableProfileState {
  name: string;
  location: string;
  bio: string;
  avatarUrl: string;
  backsplashUrl: string;
}

const IMAGE_UPLOAD_CONSTRAINTS = {
  avatarUrl: { maxWidth: 512, maxHeight: 512, quality: 0.82 },
  backsplashUrl: { maxWidth: 1600, maxHeight: 900, quality: 0.82 },
} as const;

function isLocalImageSource(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

function getScaledDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function readFileAsOptimizedDataUrl(
  file: File,
  targetField: "backsplashUrl" | "avatarUrl"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      const { maxWidth, maxHeight, quality } = IMAGE_UPLOAD_CONSTRAINTS[targetField];
      const { width, height } = getScaledDimensions(image.width, image.height, maxWidth, maxHeight);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to prepare image upload."));
        return;
      }

      context.drawImage(image, 0, 0, width, height);

      try {
        const dataUrl = canvas.toDataURL("image/webp", quality);
        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      } catch {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to process image file."));
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to read image file."));
    };

    image.src = objectUrl;
  });
}

export function ProfileHeader({ user, isOwnProfile = false }: ProfileHeaderProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<EditableProfileState>({
    name: user.name,
    location: user.location ?? "",
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl ?? "",
    backsplashUrl: user.backsplashUrl ?? DEFAULT_BACKSPLASH_IMAGE,
  });
  const [draftProfile, setDraftProfile] = useState<EditableProfileState>(profile);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleOpenEditModal() {
    setDraftProfile(profile);
    setSaveError(null);
    setIsEditModalOpen(true);
  }

  async function handleSave() {
    if (isSaving) return;

    const normalizedName = draftProfile.name.trim();
    if (!normalizedName) {
      setSaveError("Name is required.");
      return;
    }

    setSaveError(null);
    setIsSaving(true);

    try {
      const response = await updateProfile({
        name: normalizedName,
        location: draftProfile.location.trim() || null,
        bio: draftProfile.bio.trim() || null,
        avatarUrl: draftProfile.avatarUrl.trim() || null,
        backsplashUrl:
          draftProfile.backsplashUrl.trim() === DEFAULT_BACKSPLASH_IMAGE
            ? null
            : draftProfile.backsplashUrl.trim() || null,
      });

      setProfile({
        name: response.user.name,
        location: response.user.location ?? "",
        bio: response.user.bio ?? "",
        avatarUrl: response.user.avatarUrl ?? "",
        backsplashUrl: response.user.backsplashUrl ?? DEFAULT_BACKSPLASH_IMAGE,
      });
      setIsEditModalOpen(false);
      router.refresh();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setDraftProfile(profile);
    setSaveError(null);
    setIsEditModalOpen(false);
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    targetField: "backsplashUrl" | "avatarUrl"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsOptimizedDataUrl(file, targetField);
      setDraftProfile((prev) => ({ ...prev, [targetField]: dataUrl }));
      setSaveError(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to process image upload.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div>
      {/* Cover image */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-text-primary rounded-lg">
        {isLocalImageSource(profile.backsplashUrl) ? (
          <img
            src={profile.backsplashUrl}
            alt="Profile cover"
            className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none"
          />
        ) : (
          <Image
            src={profile.backsplashUrl}
            alt="Profile cover"
            fill
            className="object-cover opacity-70 pointer-events-none"
            sizes="100vw"
            priority
          />
        )}
      </div>

      {/* Avatar + name */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-0">
        <div className="relative -mt-12 w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-bg-gray flex-shrink-0">
          {profile.avatarUrl ? (
            isLocalImageSource(profile.avatarUrl) ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            )
          ) : (
            <div className="w-full h-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-text-primary truncate">
              {profile.name}
            </h1>
            {profile.location ? (
              <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {profile.location}
              </p>
            ) : null}
          </div>

          {isOwnProfile ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border-medium text-text-primary hover:bg-bg-faint transition-colors"
              >
                Edit profile
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 px-4 sm:px-0">
        {profile.bio ? (
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
        ) : (
          <p className="text-sm text-text-muted">No bio yet.</p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-6 px-4 sm:px-0">
        <StatItem value={formatCents(user.amountRaised)} label="raised" />
        <StatItem value={String(user.followerCount)} label="followers" />
        <StatItem value={String(user.fundraiserCount)} label="fundraisers" />
        <StatItem value={String(user.donationCount)} label="donations" />
      </div>

      {/* Badges */}
      <div className="mt-4 px-4 sm:px-0">
        <Badges badges={MOCK_BADGES} maxVisible={5} />
      </div>

      {isEditModalOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 px-4 py-8 overflow-y-auto"
          onClick={handleCancel}
        >
          <div
            className="mx-auto w-full max-w-2xl rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void handleSave();
              }}
            >
              <h2 className="text-lg font-semibold text-text-primary">Edit profile</h2>

              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary">Backsplash image</p>
                <div className="relative h-28 rounded-md border border-border-medium overflow-hidden bg-bg-gray">
                  {draftProfile.backsplashUrl ? (
                    <img
                      src={draftProfile.backsplashUrl}
                      alt="Backsplash preview"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <input
                  id="profile-backsplash-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => void handleImageUpload(e, "backsplashUrl")}
                  className="sr-only"
                />
                <label
                  htmlFor="profile-backsplash-upload"
                  className="inline-flex cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-md border border-border-medium text-text-primary hover:bg-bg-faint transition-colors"
                >
                  Upload backsplash
                </label>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary">Avatar image</p>
                <div className="w-16 h-16 rounded-full border border-border-medium overflow-hidden bg-bg-gray">
                  {draftProfile.avatarUrl ? (
                    <img
                      src={draftProfile.avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                      {draftProfile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <input
                  id="profile-avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => void handleImageUpload(e, "avatarUrl")}
                  className="sr-only"
                />
                <label
                  htmlFor="profile-avatar-upload"
                  className="inline-flex cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-md border border-border-medium text-text-primary hover:bg-bg-faint transition-colors"
                >
                  Upload avatar
                </label>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="profile-name"
                  className="text-xs font-medium text-text-secondary"
                >
                  Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={draftProfile.name}
                  onChange={(e) =>
                    setDraftProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-md border border-border-medium px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="profile-location"
                  className="text-xs font-medium text-text-secondary"
                >
                  Location
                </label>
                <input
                  id="profile-location"
                  type="text"
                  value={draftProfile.location}
                  onChange={(e) =>
                    setDraftProfile((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full rounded-md border border-border-medium px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="Your location"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="profile-description"
                  className="text-xs font-medium text-text-secondary"
                >
                  Description
                </label>
                <textarea
                  id="profile-description"
                  value={draftProfile.bio}
                  onChange={(e) =>
                    setDraftProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full min-h-24 rounded-md border border-border-medium px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="Tell your story..."
                />
              </div>

              {saveError ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </p>
              ) : null}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border-medium text-text-primary hover:bg-bg-faint transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}
