import {
  Accessibility,
  VolumeX,
  Armchair,
  TramFront,
  Hand,
  Info,
} from "lucide-react";

const icons = {
  stepFree: Accessibility,
  quiet: VolumeX,
  seating: Armchair,
  transit: TramFront,
  toilet: Accessibility,
  signLanguage: Hand,
};
export default function Icon({ name, ...props }) {
  const I = icons[name] || Info;
  return <I size={16} aria-hidden="true" {...props} />;
}
