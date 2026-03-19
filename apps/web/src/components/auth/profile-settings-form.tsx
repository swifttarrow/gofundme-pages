"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, getCurrentUser, updateProfile } from "@/lib/api";

export function ProfileSettingsForm() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((response) => {
        if (!isMounted) return;
        setUser(response.user);
        setName(response.user.name);
        setBio(response.user.bio ?? "");
        setAvatarUrl(response.user.avatarUrl ?? "");
        setLocation(response.user.location ?? "");
      })
      .catch(() => {
        if (!isMounted) return;
        router.push("/sign-in");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    setError(null);
    setSuccess(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Full name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await updateProfile({
        name: trimmedName,
        bio: bio.trim() ? bio : null,
        avatarUrl: avatarUrl.trim() ? avatarUrl : null,
        location: location.trim() ? location : null,
      });
      const u = response.user;
      setUser(u);
      setName(u.name);
      setBio(u.bio ?? "");
      setAvatarUrl(u.avatarUrl ?? "");
      setLocation(u.location ?? "");
      setSuccess("Profile saved.");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save profile";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-faint px-4 py-12">
        <div className="max-w-2xl mx-auto rounded-xl border border-border-light bg-white p-6 shadow-sm">
          <p className="text-sm text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-faint px-4 py-12">
      <div className="max-w-2xl mx-auto rounded-xl border border-border-light bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-text-primary">Profile settings</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Your account is signed in as <span className="font-medium text-text-primary">{user.email}</span>.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-1.5">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              autoComplete="address-level2"
              placeholder="City, State"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="avatar-url" className="block text-sm font-medium text-text-primary mb-1.5">
              Avatar URL
            </label>
            <input
              id="avatar-url"
              name="avatar-url"
              type="url"
              autoComplete="url"
              placeholder="https://example.com/avatar.jpg"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-1.5">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder="Tell the community a bit about yourself."
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
