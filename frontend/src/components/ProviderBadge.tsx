interface ProviderBadgeProps {
  slug: string;
}

export function ProviderBadge({ slug }: ProviderBadgeProps) {
  return <span className="provider-badge">{slug}</span>;
}
