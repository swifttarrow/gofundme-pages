"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { SeedUser, formatCents } from "@/lib/seed-data";
import { Badges, MOCK_BADGES } from "@/components/badges";

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

function isLocalImageSource(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:");
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image file."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

export function ProfileHeader({ user, isOwnProfile = false }: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<EditableProfileState>({
    name: user.name,
    location: user.location ?? "",
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl ?? "",
    backsplashUrl: DEFAULT_BACKSPLASH_IMAGE,
  });
  const [draftProfile, setDraftProfile] = useState<EditableProfileState>(profile);

  function handleOpenEditModal() {
    setDraftProfile(profile);
    setIsEditModalOpen(true);
  }

  function handleSave() {
    setProfile({
      ...draftProfile,
      name: draftProfile.name.trim() || user.name,
      location: draftProfile.location.trim(),
      bio: draftProfile.bio.trim(),
      avatarUrl: draftProfile.avatarUrl.trim(),
      backsplashUrl: draftProfile.backsplashUrl.trim() || DEFAULT_BACKSPLASH_IMAGE,
    });
    setIsEditModalOpen(false);
  }

  function handleCancel() {
    setDraftProfile(profile);
    setIsEditModalOpen(false);
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    targetField: "backsplashUrl" | "avatarUrl"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setDraftProfile((prev) => ({ ...prev, [targetField]: dataUrl }));
    event.target.value = "";
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
                handleSave();
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
                  className="text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  Save
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
