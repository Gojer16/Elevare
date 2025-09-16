'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import ThemeSwitcher from "./ThemeSwitcher";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = ["Appearance", "Account", "Notifications"] as const;
type Section = (typeof SECTIONS)[number];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<Section>("Appearance");

  const renderSection = () => {
    switch (activeSection) {
      case "Appearance":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <ThemeSwitcher />
            </div>
          </div>
        );
      case "Account":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Account</h3>
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span className="text-sm text-[var(--color-primary)] cursor-pointer hover:underline">
                Change
              </span>
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Notifications</h3>
            <p className="text-sm opacity-70">Coming soon…</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <div className="flex h-[400px]">
          {/* Sidebar */}
          <aside className="w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4">
            <nav className="flex flex-col gap-2">
              {SECTIONS.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-left px-3 py-2 rounded-md transition ${
                    activeSection === section
                      ? "bg-[var(--color-primary)] text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {section}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 pl-6">{renderSection()}</main>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 transition">
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
