import type { LucideIcon } from "lucide-react";
import {
  Flame,
  Activity,
  Mountain,
  CloudLightning,
  Waves,
  Sun,
  CloudFog,
  MountainSnow,
  Factory,
  Snowflake,
  CloudSnow,
  Thermometer,
  Droplets,
} from "lucide-react";

export interface CategoryConfig {
  color: string;
  icon: LucideIcon;
  label: string;
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  wildfires: { color: "#FF6B35", icon: Flame, label: "Wildfires" },
  earthquakes: { color: "#FFD700", icon: Activity, label: "Earthquakes" },
  volcanoes: { color: "#FF4444", icon: Mountain, label: "Volcanoes" },
  severeStorms: { color: "#8B5CF6", icon: CloudLightning, label: "Severe Storms" },
  floods: { color: "#3B82F6", icon: Waves, label: "Floods" },
  drought: { color: "#D97706", icon: Sun, label: "Drought" },
  dustHaze: { color: "#A8A29E", icon: CloudFog, label: "Dust & Haze" },
  landslides: { color: "#92400E", icon: MountainSnow, label: "Landslides" },
  manmade: { color: "#EC4899", icon: Factory, label: "Manmade" },
  seaLakeIce: { color: "#67E8F9", icon: Snowflake, label: "Sea & Lake Ice" },
  snow: { color: "#E0F2FE", icon: CloudSnow, label: "Snow" },
  tempExtremes: { color: "#EF4444", icon: Thermometer, label: "Temperature Extremes" },
  waterColor: { color: "#22D3EE", icon: Droplets, label: "Water Color" },
};

export const CATEGORY_IDS = Object.keys(CATEGORIES);

const DEFAULT_CONFIG: CategoryConfig = {
  color: "#9CA3AF",
  icon: Activity,
  label: "Unknown",
};

export function getCategoryConfig(id: string): CategoryConfig {
  return CATEGORIES[id] ?? DEFAULT_CONFIG;
}
