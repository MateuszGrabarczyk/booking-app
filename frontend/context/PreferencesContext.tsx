import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useCategories } from "@/hooks/useCategories";
import { useProfiles } from "@/hooks/useProfiles";
import type { Category } from "@/app/api/categories/route";

interface PrefsContext {
  allCats: Category[];
  selectedCats: Category[];
  setSelectedCats: (cats: Category[]) => void;
}

const PreferencesContext = createContext<PrefsContext | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { categories: allCats, loading: catsLoading } = useCategories();
  const { profile, loading: profileLoading } = useProfiles();
  const [selectedCats, setSelectedCats] = useState<Category[]>([]);

  useEffect(() => {
    if (!catsLoading && !profileLoading && allCats.length > 0) {
      if (profile?.preferred_categories?.length) {
        setSelectedCats(
          allCats.filter((c) => profile.preferred_categories.includes(c.id))
        );
      } else {
        setSelectedCats(allCats);
      }
    }
  }, [catsLoading, profileLoading, allCats, profile]);

  return (
    <PreferencesContext.Provider
      value={{ allCats, selectedCats, setSelectedCats }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be inside PreferencesProvider");
  return ctx;
}
