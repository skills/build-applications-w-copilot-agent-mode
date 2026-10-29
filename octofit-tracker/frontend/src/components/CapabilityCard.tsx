type Props = { title: string; description: string };
export function CapabilityCard({ title, description }: Props) {
  return <section className="card h-100"><div className="card-body"><h2 className="h4">{title}</h2><p>{description}</p><p role="status">Implementation pending</p></div></section>;
}
